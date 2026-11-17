```cpp
#include <algorithm>
#include <cctype>
#include <cstdlib>
#include <iomanip>
#include <iostream>
#include <map>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

// Amounts and token IDs are uint256 values on chain. This example keeps them in
// 128-bit integers (enough for any realistic 18-decimal amount) and rejects
// deposits that do not fit.
typedef unsigned __int128 uint128;

static const std::string ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

static std::string to_lower(std::string s)
{
    std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
    return s;
}

static std::string strip_0x_prefix(const std::string &hex)
{
    if (hex.rfind("0x", 0) == 0 || hex.rfind("0X", 0) == 0)
    {
        return hex.substr(2);
    }
    return hex;
}

static std::string hex_to_utf8(const std::string &hex)
{
    const std::string raw = strip_0x_prefix(hex);
    std::string out;
    out.reserve(raw.size() / 2);
    for (size_t i = 0; i + 1 < raw.size(); i += 2)
    {
        out.push_back(static_cast<char>(std::stoi(raw.substr(i, 2), nullptr, 16)));
    }
    return out;
}

static std::string utf8_to_hex(const std::string &text)
{
    std::ostringstream oss;
    oss << "0x";
    for (unsigned char c : text)
    {
        oss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(c);
    }
    return oss.str();
}

// Parses a decimal string, or a 0x-prefixed hex string (as BigInt() does in JavaScript)
static uint128 parse_uint(const std::string &text)
{
    std::string digits = text;
    unsigned base = 10;
    if (digits.size() > 2 && (digits.rfind("0x", 0) == 0 || digits.rfind("0X", 0) == 0))
    {
        digits = digits.substr(2);
        base = 16;
    }
    if (digits.empty())
    {
        throw std::runtime_error("Cannot convert " + text + " to an integer");
    }
    const uint128 max = ~static_cast<uint128>(0);
    uint128 value = 0;
    for (char c : digits)
    {
        unsigned digit;
        if (c >= '0' && c <= '9')
        {
            digit = c - '0';
        }
        else if (base == 16 && std::isxdigit(static_cast<unsigned char>(c)))
        {
            digit = std::tolower(static_cast<unsigned char>(c)) - 'a' + 10;
        }
        else
        {
            throw std::runtime_error("Cannot convert " + text + " to an integer");
        }
        if (value > (max - digit) / base)
        {
            throw std::runtime_error("Value " + text + " does not fit in 128 bits");
        }
        value = value * base + digit;
    }
    return value;
}

static std::string to_decimal(uint128 value)
{
    if (value == 0)
    {
        return "0";
    }
    std::string out;
    while (value > 0)
    {
        out.insert(out.begin(), static_cast<char>('0' + static_cast<int>(value % 10)));
        value /= 10;
    }
    return out;
}

// 32-byte big-endian ABI word, without the 0x prefix
static std::string to_abi_word(uint128 value)
{
    std::string out(64, '0');
    for (int i = 63; i >= 0 && value > 0; --i)
    {
        out[i] = "0123456789abcdef"[static_cast<int>(value & 0xf)];
        value >>= 4;
    }
    return out;
}

struct Marketplace
{
    std::string erc721_portal = to_lower("0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E");
    std::string erc20_portal = to_lower("0x3332DE61a8BB9aC84893b2f552Fe81C9a6dC5419");
    std::string erc721_token = to_lower("0x0761b8e3aB06F458632974393C48765E6Ddc61bB");
    std::string erc20_token = to_lower("0x86EA17052C8e335Ad830B54EF566274EAB46B852");
    uint128 list_price = static_cast<uint128>(100) * 1000000000000000000ULL; // 100 tokens (18 decimals)

    std::vector<uint128> listed_tokens;
    std::map<uint128, std::string> token_owner;
    std::map<std::string, uint128> erc20_balance;
};

static Marketplace storage;

static bool is_listed(uint128 token_id)
{
    return std::find(storage.listed_tokens.begin(), storage.listed_tokens.end(), token_id) != storage.listed_tokens.end();
}

static uint128 balance_of(const std::string &user)
{
    const std::map<std::string, uint128>::const_iterator it = storage.erc20_balance.find(to_lower(user));
    return it == storage.erc20_balance.end() ? 0 : it->second;
}

static void increase_balance(const std::string &user, uint128 amount)
{
    uint128 &balance = storage.erc20_balance[to_lower(user)];
    if (balance > ~static_cast<uint128>(0) - amount)
    {
        throw std::runtime_error("Balance of user " + user + " does not fit in 128 bits");
    }
    balance += amount;
}

static void reduce_balance(const std::string &user, uint128 amount)
{
    const uint128 balance = balance_of(user);
    if (balance < amount)
    {
        throw std::runtime_error("User " + user + " has insufficient balance");
    }
    storage.erc20_balance[to_lower(user)] = balance - amount;
}

static bool post_output(httplib::Client &cli, const std::string &endpoint, const picojson::object &body)
{
    auto res = cli.Post(endpoint.c_str(), picojson::value(body).serialize(), "application/json");
    return res && res->status < 400;
}

static void emit_report(httplib::Client &cli, const std::string &text)
{
    picojson::object body;
    body["payload"] = picojson::value(utf8_to_hex(text));
    post_output(cli, "/report", body);
}

static void emit_notice(httplib::Client &cli, const std::string &text)
{
    picojson::object body;
    body["payload"] = picojson::value(utf8_to_hex(text));
    if (!post_output(cli, "/notice", body))
    {
        throw std::runtime_error("Failed to generate notice");
    }
}

static void emit_voucher(httplib::Client &cli, const std::string &destination, const std::string &payload)
{
    picojson::object body;
    body["destination"] = picojson::value(destination);
    body["payload"] = picojson::value(payload);
    body["value"] = picojson::value("0x" + to_abi_word(0)); // no Ether sent with the call
    if (!post_output(cli, "/voucher", body))
    {
        throw std::runtime_error("Failed to generate voucher");
    }
}

struct Deposit
{
    std::string token;
    std::string sender;
    uint128 amount; // amount (ERC-20) or token ID (ERC-721)
};

static Deposit parse_deposit(const std::string &payload_hex)
{
    // ERC-20 and ERC-721 deposits start with the same packed fields:
    // token (20 bytes), sender (20 bytes), amount or token ID (32 bytes)
    const std::string hex = to_lower(strip_0x_prefix(payload_hex));
    if (hex.size() < 144)
    {
        throw std::runtime_error("payload too short: " + std::to_string(hex.size() / 2) + " bytes");
    }
    const std::string word = hex.substr(80, 64);
    if (word.find_first_not_of('0') < 32)
    {
        throw std::runtime_error("Deposited value does not fit in 128 bits");
    }
    Deposit deposit;
    deposit.token = "0x" + hex.substr(0, 40);
    deposit.sender = "0x" + hex.substr(40, 40);
    deposit.amount = parse_uint("0x" + word.substr(32));
    return deposit;
}

static std::string encode_transfer_from(const std::string &from, const std::string &to, uint128 token_id)
{
    const std::string selector = "23b872dd"; // transferFrom(address,address,uint256)
    const std::string from_padded = std::string(24, '0') + to_lower(strip_0x_prefix(from));
    const std::string to_padded = std::string(24, '0') + to_lower(strip_0x_prefix(to));
    return "0x" + selector + from_padded + to_padded + to_abi_word(token_id);
}

// Returns the field as a string, or an empty string when it is missing or not a string
static std::string string_field(const picojson::value &json, const std::string &field)
{
    if (!json.is<picojson::object>() || !json.get(field).is<std::string>())
    {
        return "";
    }
    return json.get(field).get<std::string>();
}

static std::string extract_field(const picojson::value &json, const std::string &field)
{
    const std::string value = string_field(json, field);
    if (value.find_first_not_of(" \t\r\n") == std::string::npos)
    {
        throw std::runtime_error("Missing or invalid " + field + " field in payload");
    }
    return value;
}

static void handle_erc20_deposit(const std::string &depositor, uint128 amount, const std::string &token)
{
    if (token != storage.erc20_token)
    {
        throw std::runtime_error("Unsupported token deposited");
    }
    increase_balance(depositor, amount);
    std::cout << "Token deposit processed successfully" << std::endl;
}

static void handle_erc721_deposit(httplib::Client &cli, const std::string &depositor, uint128 token_id, const std::string &token)
{
    if (token != storage.erc721_token)
    {
        throw std::runtime_error("Unsupported token deposited");
    }
    storage.token_owner[token_id] = depositor;
    if (!is_listed(token_id))
    {
        storage.listed_tokens.push_back(token_id);
    }
    std::cout << "Token deposit and listing processed successfully" << std::endl;
    emit_notice(cli, "Token ID: " + to_decimal(token_id) + " Deposited by User: " + depositor);
}

static void handle_purchase_token(httplib::Client &cli, const std::string &buyer, const picojson::value &input, const std::string &app_contract)
{
    const uint128 token_id = parse_uint(extract_field(input, "token_id"));
    if (!is_listed(token_id))
    {
        throw std::runtime_error("Token " + storage.erc721_token + " with id " + to_decimal(token_id) + " is not for sale");
    }
    const std::map<uint128, std::string>::const_iterator owner = storage.token_owner.find(token_id);
    if (owner == storage.token_owner.end())
    {
        throw std::runtime_error("Token owner for token " + storage.erc721_token + " with id " + to_decimal(token_id) + " not found");
    }
    const std::string seller = owner->second;

    reduce_balance(buyer, storage.list_price);
    increase_balance(seller, storage.list_price);
    // the NFT leaves the marketplace with the voucher below
    storage.token_owner[token_id] = ZERO_ADDRESS;
    storage.listed_tokens.erase(std::remove(storage.listed_tokens.begin(), storage.listed_tokens.end(), token_id), storage.listed_tokens.end());
    std::cout << "Token purchased successfully" << std::endl;

    // The application contract holds the deposited NFTs and executes the
    // voucher, so it is the `from` address of the transfer
    emit_voucher(cli, storage.erc721_token, encode_transfer_from(app_contract, buyer, token_id));
    std::cout << "Voucher generation successful" << std::endl;
}

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;
    try
    {
        const std::string sender = to_lower(data.get("metadata").get("msg_sender").get<std::string>());
        const std::string app_contract = to_lower(data.get("metadata").get("app_contract").get<std::string>());
        const std::string payload = data.get("payload").get<std::string>();

        if (sender == storage.erc20_portal)
        {
            const Deposit deposit = parse_deposit(payload);
            handle_erc20_deposit(deposit.sender, deposit.amount, deposit.token);
        }
        else if (sender == storage.erc721_portal)
        {
            const Deposit deposit = parse_deposit(payload);
            handle_erc721_deposit(cli, deposit.sender, deposit.amount, deposit.token);
        }
        else
        {
            picojson::value input;
            if (!picojson::parse(input, hex_to_utf8(payload)).empty())
            {
                throw std::runtime_error("Invalid payload JSON");
            }
            if (string_field(input, "method") != "purchase_token")
            {
                throw std::runtime_error("Unsupported method called!!");
            }
            handle_purchase_token(cli, sender, input, app_contract);
        }
        return "accept";
    }
    catch (const std::exception &e)
    {
        std::cout << "Error processing advance request: " << e.what() << std::endl;
        emit_report(cli, e.what());
        return "reject";
    }
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    const std::string text = hex_to_utf8(data.get("payload").get<std::string>());
    std::cout << "Received inspect request with payload " << text << std::endl;

    picojson::value input;
    if (!picojson::parse(input, text).empty())
    {
        emit_report(cli, "Invalid payload JSON");
        return "accept";
    }

    try
    {
        const std::string method = string_field(input, "method");
        if (method == "get_user_erc20_balance")
        {
            const std::string user = string_field(input, "user_address");
            emit_report(cli, "User: " + user + " Balance: " + to_decimal(balance_of(user)));
        }
        else if (method == "get_token_owner")
        {
            // the token ID can be a JSON number or a string
            const uint128 token_id = parse_uint(input.get("token_id").to_str());
            const std::map<uint128, std::string>::const_iterator owner = storage.token_owner.find(token_id);
            emit_report(cli, "Token_id: " + to_decimal(token_id) + " owner: " + (owner == storage.token_owner.end() ? "None" : owner->second));
        }
        else if (method == "get_all_listed_tokens")
        {
            std::string list;
            for (size_t i = 0; i < storage.listed_tokens.size(); ++i)
            {
                list += (i > 0 ? "," : "") + to_decimal(storage.listed_tokens[i]);
            }
            emit_report(cli, "All listed tokens are: " + list);
        }
        else
        {
            std::cout << "Unsupported method called!!" << std::endl;
            emit_report(cli, "Unsupported inspect method");
        }
        return "accept";
    }
    catch (const std::exception &e)
    {
        emit_report(cli, e.what());
        return "reject";
    }
}

int main(int argc, char **argv)
{
    (void)argc;
    (void)argv;

    std::map<std::string, decltype(&handle_advance)> handlers = {
        {std::string("advance_state"), &handle_advance},
        {std::string("inspect_state"), &handle_inspect},
    };

    httplib::Client cli(getenv("ROLLUP_HTTP_SERVER_URL"));
    cli.set_read_timeout(20, 0);
    std::string status("accept");

    while (true)
    {
        const std::string finish = std::string("{\"status\":\"") + status + std::string("\"}");
        auto r = cli.Post("/finish", finish, "application/json");
        if (!r || r->status == 202)
        {
            continue;
        }

        picojson::value rollup_request;
        picojson::parse(rollup_request, r->body);
        const std::string request_type = rollup_request.get("request_type").get<std::string>();
        const picojson::value request_data = rollup_request.get("data");
        status = handlers.find(request_type)->second(cli, request_data);
    }

    return 0;
}
```
