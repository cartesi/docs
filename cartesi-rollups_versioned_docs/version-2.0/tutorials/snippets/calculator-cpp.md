```cpp
#include <iomanip>
#include <iostream>
#include <map>
#include <sstream>
#include <stdexcept>
#include <string>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

static std::string hex_to_string(const std::string &hex)
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

static std::string string_to_hex(const std::string &text)
{
    std::ostringstream oss;
    oss << "0x";
    for (unsigned char c : text)
    {
        oss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(c);
    }
    return oss.str();
}

static double evaluate_expression(const std::string &expr)
{
    // Minimal parser for "number op number" expressions (e.g. 1+2, 7*3).
    std::stringstream ss(expr);
    double lhs = 0.0;
    double rhs = 0.0;
    char op = 0;
    ss >> lhs >> op >> rhs;
    if (ss.fail())
    {
        throw std::runtime_error("invalid expression format");
    }
    switch (op)
    {
    case '+': return lhs + rhs;
    case '-': return lhs - rhs;
    case '*': return lhs * rhs;
    case '/':
        if (rhs == 0.0)
        {
            throw std::runtime_error("division by zero");
        }
        return lhs / rhs;
    default:
        throw std::runtime_error("unsupported operator");
    }
}

static void emit_notice(httplib::Client &cli, const std::string &text)
{
    picojson::object notice;
    notice["payload"] = picojson::value(string_to_hex(text));
    cli.Post("/notice", picojson::value(notice).serialize(), "application/json");
}

static void emit_report(httplib::Client &cli, const std::string &payload_hex)
{
    picojson::object report;
    report["payload"] = picojson::value(payload_hex);
    cli.Post("/report", picojson::value(report).serialize(), "application/json");
}

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;
    try
    {
        const std::string payload_hex = data.get("payload").get<std::string>();
        const std::string expression = hex_to_string(payload_hex);
        const double output = evaluate_expression(expression);
        emit_notice(cli, std::to_string(output));
        return "accept";
    }
    catch (const std::exception &e)
    {
        emit_report(cli, string_to_hex(std::string("Error processing input: ") + e.what()));
        return "reject";
    }
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received inspect request data " << data << std::endl;
    emit_report(cli, data.get("payload").get<std::string>());
    return "accept";
}

int main(int argc, char **argv)
{
    std::map<std::string, decltype(&handle_advance)> handlers = {
        {"advance_state", &handle_advance},
        {"inspect_state", &handle_inspect},
    };

    httplib::Client cli(getenv("ROLLUP_HTTP_SERVER_URL"));
    std::string status = "accept";

    while (true)
    {
        auto finish_body = std::string("{\"status\":\"") + status + "\"}";
        auto response = cli.Post("/finish", finish_body, "application/json");
        if (!response)
        {
            status = "reject";
            continue;
        }

        if (response->status == 202)
        {
            std::cout << "No pending rollup request, trying again" << std::endl;
            status = "accept";
            continue;
        }

        picojson::value req;
        picojson::parse(req, response->body);
        auto request_type = req.get("request_type").get<std::string>();
        auto data = req.get("data");
        status = handlers[request_type](cli, data);
    }
}
```
