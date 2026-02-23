```cpp
#include <stdio.h>
#include <iostream>
#include <map>
#include <string>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

namespace voucher_config
{
// Sample values used to build the voucher payload.
const std::string kVoucherTokenAddress = "0x5138f529B77B4e0a7c84B77E79c4335D31938fed";
const std::string kVoucherRecipientAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const std::string kVoucherAmountWeiHex = "0de0b6b3a7640000";
} // namespace voucher_config

std::string get_input_payload(const picojson::value &data)
{
    // Rollups input payload is expected at data.payload as a hex string.
    if (!data.is<picojson::object>())
    {
        return "0x";
    }

    const auto &obj = data.get<picojson::object>();
    const auto it = obj.find("payload");
    if (it == obj.end() || !it->second.is<std::string>())
    {
        return "0x";
    }
    return it->second.get<std::string>();
}

void post_payload(httplib::Client &cli, const std::string &endpoint, const std::string &payload)
{
    picojson::object body;
    body["payload"] = picojson::value(payload);
    auto res = cli.Post(endpoint.c_str(), picojson::value(body).serialize(), "application/json");
    if (res)
    {
        std::cout << "Sent " << endpoint << ", status " << res->status << std::endl;
    }
    else
    {
        std::cout << "Failed sending " << endpoint << std::endl;
    }
}

void post_sample_erc20_transfer_voucher(httplib::Client &cli)
{
    const std::string recipient_padded =
        "000000000000000000000000" + voucher_config::kVoucherRecipientAddress.substr(2);
    const std::string amount_padded =
        "000000000000000000000000000000000000000000000000" + voucher_config::kVoucherAmountWeiHex;
    // ERC-20 transfer(address,uint256) selector.
    const std::string payload = "0xa9059cbb" + recipient_padded + amount_padded;

    picojson::object body;
    body["destination"] = picojson::value(voucher_config::kVoucherTokenAddress);
    body["payload"] = picojson::value(payload);
    auto res = cli.Post("/voucher", picojson::value(body).serialize(), "application/json");
    if (res)
    {
        std::cout << "Sent /voucher, status " << res->status << std::endl;
    }
    else
    {
        std::cout << "Failed sending /voucher" << std::endl;
    }
}

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;
    const auto input_payload = get_input_payload(data);
    // Echo input payload to notice and report.
    post_payload(cli, "/notice", input_payload);
    post_payload(cli, "/report", input_payload);
    post_sample_erc20_transfer_voucher(cli);
    return "accept";
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received inspect request data " << data << std::endl;
    return "accept";
}

int main(int argc, char **argv)
{
    std::map<std::string, decltype(&handle_advance)> handlers = {
        {std::string("advance_state"), &handle_advance},
        {std::string("inspect_state"), &handle_inspect},
    };
    httplib::Client cli(getenv("ROLLUP_HTTP_SERVER_URL"));
    cli.set_read_timeout(20, 0);
    std::string status("accept");
    std::string rollup_address;
    while (true)
    {
        std::cout << "Sending finish" << std::endl;
        auto finish = std::string("{\"status\":\"") + status + std::string("\"}");
        auto r = cli.Post("/finish", finish, "application/json");
        std::cout << "Received finish status " << r.value().status << std::endl;
        if (r.value().status == 202)
        {
            std::cout << "No pending rollup request, trying again" << std::endl;
        }
        else
        {
            picojson::value rollup_request;
            picojson::parse(rollup_request, r.value().body);
            picojson::value metadata = rollup_request.get("data").get("metadata");
            auto request_type = rollup_request.get("request_type").get<std::string>();
            auto handler = handlers.find(request_type)->second;
            auto data = rollup_request.get("data");
            status = (*handler)(cli, data);
        }
    }
    return 0;
}
```