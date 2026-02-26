```cpp
#include <algorithm>
#include <cctype>
#include <cstdlib>
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

struct Marketplace
{
    std::string erc721_portal = "0x9E8851dadb2b77103928518846c4678d48b5e371";
    std::string erc20_portal = "0xACA6586A0Cf05bD831f2501E7B4aea550dA6562D";
    std::string erc721_token = "0x1c5AB37576Af4e6BEeCB66Fa6a9FdBc608F44B78";
    std::string erc20_token = "0x5138f529B77B4e0a7c84B77E79c4335D31938fed";
    std::string app_address = "0x0000000000000000000000000000000000000000";

    std::vector<std::string> listed_tokens;
    std::map<std::string, std::string> token_owner;
    std::map<std::string, std::string> erc20_balance;
};

static Marketplace storage;

static bool is_listed(const std::string &token_id)
{
    return std::find(storage.listed_tokens.begin(), storage.listed_tokens.end(), token_id) != storage.listed_tokens.end();
}

static void emit_output(httplib::Client &cli, const std::string &endpoint, const std::string &text)
{
    picojson::object body;
    body["payload"] = picojson::value(utf8_to_hex(text));
    cli.Post(endpoint.c_str(), picojson::value(body).serialize(), "application/json");
}

static void emit_report(httplib::Client &cli, const std::string &text)
{
    emit_output(cli, "/report", text);
}

static void emit_notice(httplib::Client &cli, const std::string &text)
{
    emit_output(cli, "/notice", text);
}

static std::string parse_token_address(const std::string &payload_hex)
{
    const std::string hex = strip_0x_prefix(payload_hex);
    if (hex.size() < 40)
    {
        return "0x0000000000000000000000000000000000000000";
    }
    return "0x" + hex.substr(0, 40);
}

static std::string parse_receiver_address(const std::string &payload_hex)
{
    const std::string hex = strip_0x_prefix(payload_hex);
    if (hex.size() < 80)
    {
        return "0x0000000000000000000000000000000000000000";
    }
    return "0x" + hex.substr(40, 40);
}

static std::string parse_amount_or_token_id(const std::string &payload_hex)
{
    const std::string hex = strip_0x_prefix(payload_hex);
    if (hex.size() < 144)
    {
        return "0";
    }
    std::string word = hex.substr(80, 64);
    while (word.size() > 1 && word[0] == '0')
    {
        word.erase(word.begin());
    }
    return word;
}

static std::string encode_transfer_from(const std::string &from, const std::string &to, const std::string &token_id_hex)
{
    const std::string selector = "23b872dd";
    const std::string from_padded = "000000000000000000000000" + to_lower(from.substr(2));
    const std::string to_padded = "000000000000000000000000" + to_lower(to.substr(2));
    std::string token_id_padded = token_id_hex;
    if (token_id_padded.size() < 64)
    {
        token_id_padded = std::string(64 - token_id_padded.size(), '0') + token_id_padded;
    }
    return "0x" + selector + from_padded + to_padded + token_id_padded;
}

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    try
    {
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
            storage.erc20_balance[receiver] = parse_amount_or_token_id(payload);
            std::cout << "Token deposit processed successfully" << std::endl;
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

            const std::string token_id = parse_amount_or_token_id(payload);
            storage.token_owner[token_id] = receiver;
            if (!is_listed(token_id))
            {
                storage.listed_tokens.push_back(token_id);
            }
            emit_notice(cli, "Token listed successfully");
            std::cout << "Token deposit and listing processed successfully" << std::endl;
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
        voucher["value"] = picojson::value("0x00");
        auto voucher_res = cli.Post("/voucher", picojson::value(voucher).serialize(), "application/json");
        if (!voucher_res || voucher_res->status >= 400)
        {
            emit_report(cli, "Failed to generate voucher");
            return "accept";
        }
        std::cout << "Voucher generation successful" << std::endl;

        storage.token_owner[token_id] = sender;
        storage.listed_tokens.erase(std::remove(storage.listed_tokens.begin(), storage.listed_tokens.end(), token_id), storage.listed_tokens.end());
        std::cout << "Token purchased and Withdrawn successfully" << std::endl;
        return "accept";
    }
    catch (const std::exception &e)
    {
        emit_report(cli, std::string("Error: ") + e.what());
        return "accept";
    }
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    try
    {
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
    catch (const std::exception &e)
    {
        emit_report(cli, std::string("Inspect error: ") + e.what());
        return "accept";
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