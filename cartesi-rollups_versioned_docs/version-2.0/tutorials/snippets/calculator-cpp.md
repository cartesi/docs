```cpp
#include <cctype>
#include <cstdio>
#include <cstdlib>
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

// Recursive-descent parser for + - * / with the usual precedence, unary + and -,
// and parentheses (e.g. 1+2*3 = 7, (1+2)*3 = 9):
//   expression = term { ("+" | "-") term }
//   term       = factor { ("*" | "/") factor }
//   factor     = ("+" | "-") factor | "(" expression ")" | number
class ExpressionParser
{
public:
    explicit ExpressionParser(const std::string &text) : text_(text), pos_(0), depth_(0) {}

    double parse()
    {
        const double value = expression();
        skip_spaces();
        if (pos_ != text_.size())
        {
            throw std::runtime_error(unexpected()); // trailing input, e.g. "1 2"
        }
        return value;
    }

private:
    static const int kMaxDepth = 256; // bounds the recursion on inputs like "((((..."
    const std::string text_;
    size_t pos_;
    int depth_;

    void skip_spaces()
    {
        while (pos_ < text_.size() && std::isspace(static_cast<unsigned char>(text_[pos_])))
        {
            ++pos_;
        }
    }

    bool accept(char c)
    {
        skip_spaces();
        if (pos_ < text_.size() && text_[pos_] == c)
        {
            ++pos_;
            return true;
        }
        return false;
    }

    std::string unexpected() const
    {
        if (pos_ >= text_.size())
        {
            return "unexpected end of expression";
        }
        return "unexpected character '" + text_.substr(pos_, 1) + "' at position " + std::to_string(pos_);
    }

    double expression()
    {
        double value = term();
        while (true)
        {
            if (accept('+'))
            {
                value += term();
            }
            else if (accept('-'))
            {
                value -= term();
            }
            else
            {
                return value;
            }
        }
    }

    double term()
    {
        double value = factor();
        while (true)
        {
            if (accept('*'))
            {
                value *= factor();
            }
            else if (accept('/'))
            {
                const double divisor = factor();
                if (divisor == 0.0)
                {
                    throw std::runtime_error("division by zero");
                }
                value /= divisor;
            }
            else
            {
                return value;
            }
        }
    }

    double factor()
    {
        if (++depth_ > kMaxDepth)
        {
            throw std::runtime_error("expression is nested too deeply");
        }
        double value;
        if (accept('+'))
        {
            value = factor();
        }
        else if (accept('-'))
        {
            value = -factor();
        }
        else if (accept('('))
        {
            value = expression();
            if (!accept(')'))
            {
                throw std::runtime_error(unexpected());
            }
        }
        else
        {
            value = number();
        }
        --depth_;
        return value;
    }

    double number()
    {
        skip_spaces();
        const size_t start = pos_;
        size_t digits = 0;
        while (pos_ < text_.size() && std::isdigit(static_cast<unsigned char>(text_[pos_])))
        {
            ++pos_;
            ++digits;
        }
        if (pos_ < text_.size() && text_[pos_] == '.')
        {
            ++pos_;
            while (pos_ < text_.size() && std::isdigit(static_cast<unsigned char>(text_[pos_])))
            {
                ++pos_;
                ++digits;
            }
        }
        if (digits == 0)
        {
            pos_ = start;
            throw std::runtime_error(unexpected());
        }
        return std::strtod(text_.substr(start, pos_ - start).c_str(), nullptr);
    }
};

static double evaluate_expression(const std::string &expr)
{
    return ExpressionParser(expr).parse();
}

// Shortest decimal form that reads back as the same number ("7", "-10", "0.3333333333333333")
static std::string format_number(double value)
{
    char buffer[32];
    if (value > -1e18 && value < 1e18 && value == static_cast<double>(static_cast<long long>(value)))
    {
        std::snprintf(buffer, sizeof(buffer), "%lld", static_cast<long long>(value));
        return buffer;
    }
    for (int precision = 1; precision <= 17; ++precision)
    {
        std::snprintf(buffer, sizeof(buffer), "%.*g", precision, value);
        if (std::strtod(buffer, nullptr) == value)
        {
            break;
        }
    }
    return buffer;
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
        emit_notice(cli, format_number(output));
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
