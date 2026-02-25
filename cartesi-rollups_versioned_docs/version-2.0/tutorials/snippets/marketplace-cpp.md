```cpp
#include <algorithm>
#include <iomanip>
#include <iostream>
#include <map>
#include <sstream>
#include <string>
#include <vector>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

static std::string to_lower(std::string s)
{
    std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c) { return std::tolower(c); });
    return s;
}

static std::string hex_to_utf8(const std::string &hex)
{
    std::string raw = hex.rfind("0x", 0) == 0 ? hex.substr(2) : hex;
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

struct Marketplace
{
    std::string erc721_portal = "0xc700d52F5290e978e9CAe7D1E092935263b60051";
    std::string erc20_portal = "0xc700D6aDd016eECd59d989C028214Eaa0fCC0051";
    std::string erc721_token = "0xBa46623aD94AB45850c4ecbA9555D26328917c3B";
    std::string erc20_token = "0xFBdB734EF6a23aD76863CbA6f10d0C5CBBD8342C";
    std::string app_address = "0x0000000000000000000000000000000000000000";
    std::string list_price_wei = "100000000000000000000";

    std::vector<std::string> listed_tokens;
    std::map<std::string, std::string> token_owner;
    std::map<std::string, std::string> erc20_balance;
};

static Marketplace storage;

static bool is_listed(const std::string &token_id)
{
    return std::find(storage.listed_tokens.begin(), storage.listed_tokens.end(), token_id) != storage.listed_tokens.end();
}

static void emit_report(httplib::Client &cli, const std::string &text)
{
    picojson::object body;
    body["payload"] = picojson::value(utf8_to_hex(text));
    cli.Post("/report", picojson::value(body).serialize(), "application/json");
}

static void emit_notice(httplib::Client &cli, const std::string &text)
{
    picojson::object body;
    body["payload"] = picojson::value(utf8_to_hex(text));
    cli.Post("/notice", picojson::value(body).serialize(), "application/json");
}

static std::string parse_erc20_or_erc721_amount(const std::string &payload_hex)
{
    std::string hex = payload_hex.rfind("0x", 0) == 0 ? payload_hex.substr(2) : payload_hex;
    if (hex.size() < 144)
    {
        return "0";
    }
    std::string amount_hex = hex.substr(80, 64);
    while (!amount_hex.empty() && amount_hex[0] == '0')
    {
        amount_hex.erase(amount_hex.begin());
    }
    return amount_hex.empty() ? "0" : amount_hex;
}

static std::string parse_token_address(const std::string &payload_hex)
{
    std::string hex = payload_hex.rfind("0x", 0) == 0 ? payload_hex.substr(2) : payload_hex;
    if (hex.size() < 40)
    {
        return "0x0000000000000000000000000000000000000000";
    }
    return "0x" + hex.substr(0, 40);
}

static std::string parse_receiver_address(const std::string &payload_hex)
{
    std::string hex = payload_hex.rfind("0x", 0) == 0 ? payload_hex.substr(2) : payload_hex;
    if (hex.size() < 80)
    {
        return "0x0000000000000000000000000000000000000000";
    }
    return "0x" + hex.substr(40, 40);
}

static std::string encode_transfer_from(const std::string &from, const std::string &to, const std::string &token_id_dec)
{
    // transferFrom(address,address,uint256) selector
    const std::string selector = "23b872dd";
    const std::string from_padded = "000000000000000000000000" + to_lower(from.substr(2));
    const std::string to_padded = "000000000000000000000000" + to_lower(to.substr(2));

    std::ostringstream token_id_hex;
    token_id_hex << std::hex << std::stoull(token_id_dec);
    std::string tid = token_id_hex.str();
    if (tid.size() < 64)
    {
        tid = std::string(64 - tid.size(), '0') + tid;
    }

    return "0x" + selector + from_padded + to_padded + tid;
}

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;

    const std::string sender = to_lower(data.get("metadata").get("msg_sender").get<std::string>());
    const std::string app_contract = to_lower(data.get("metadata").get("app_contract").get<std::string>());
    const std::string payload = data.get("payload").get<std::string>();

    if (to_lower(storage.app_address) == "0x0000000000000000000000000000000000000000")
    {
        storage.app_address = app_contract;
    }

    if (sender == to_lower(storage.erc20_portal))
    {
        const std::string token = to_lower(parse_token_address(payload));
        const std::string receiver = to_lower(parse_receiver_address(payload));
        if (token != to_lower(storage.erc20_token))
        {
            emit_report(cli, "Unsupported ERC20 token");
            return "accept";
        }
        storage.erc20_balance[receiver] = parse_erc20_or_erc721_amount(payload);
        return "accept";
    }

    if (sender == to_lower(storage.erc721_portal))
    {
        const std::string token = to_lower(parse_token_address(payload));
        const std::string receiver = to_lower(parse_receiver_address(payload));
        if (token != to_lower(storage.erc721_token))
        {
            emit_report(cli, "Unsupported ERC721 token");
            return "accept";
        }
        const std::string token_id = parse_erc20_or_erc721_amount(payload);
        storage.token_owner[token_id] = receiver;
        storage.listed_tokens.push_back(token_id);
        emit_notice(cli, "Token listed successfully");
        return "accept";
    }

    const std::string user_payload = hex_to_utf8(payload);
    picojson::value parsed;
    picojson::parse(parsed, user_payload);
    const std::string method = parsed.get("method").get<std::string>();
    if (method != "purchase_token")
    {
        emit_report(cli, "Unsupported method");
        return "accept";
    }

    std::string token_id;
    if (parsed.get("token_id").is<std::string>())
    {
        token_id = parsed.get("token_id").get<std::string>();
    }
    else
    {
        token_id = std::to_string(static_cast<unsigned long long>(parsed.get("token_id").get<double>()));
    }

    if (!is_listed(token_id))
    {
        emit_report(cli, "Token is not listed");
        return "accept";
    }

    const std::string call_data = encode_transfer_from(storage.app_address, sender, token_id);
    picojson::object voucher;
    voucher["destination"] = picojson::value(storage.erc721_token);
    voucher["payload"] = picojson::value(call_data);
    voucher["value"] = picojson::value("0x0");
    cli.Post("/voucher", picojson::value(voucher).serialize(), "application/json");

    storage.token_owner[token_id] = sender;
    storage.listed_tokens.erase(std::remove(storage.listed_tokens.begin(), storage.listed_tokens.end(), token_id), storage.listed_tokens.end());
    return "accept";
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received inspect request data " << data << std::endl;
    const std::string inspect_payload = hex_to_utf8(data.get("payload").get<std::string>());

    picojson::value parsed;
    picojson::parse(parsed, inspect_payload);
    const std::string method = parsed.get("method").get<std::string>();

    std::string report_message;
    if (method == "get_user_erc20_balance")
    {
        const std::string user = to_lower(parsed.get("user_address").get<std::string>());
        const std::string bal = storage.erc20_balance.count(user) ? storage.erc20_balance[user] : "0";
        report_message = "User: " + user + " Balance: " + bal;
    }
    else if (method == "get_token_owner")
    {
        const std::string token_id = std::to_string(static_cast<unsigned long long>(parsed.get("token_id").get<double>()));
        const std::string owner = storage.token_owner.count(token_id) ? storage.token_owner[token_id] : "None";
        report_message = "Token_id: " + token_id + " owner: " + owner;
    }
    else
    {
        std::ostringstream oss;
        oss << "All listed tokens are: [";
        for (size_t i = 0; i < storage.listed_tokens.size(); ++i)
        {
            oss << storage.listed_tokens[i];
            if (i + 1 < storage.listed_tokens.size())
            {
                oss << ",";
            }
        }
        oss << "]";
        report_message = oss.str();
    }

    emit_report(cli, report_message);
    return "accept";
}
```
