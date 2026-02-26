```cpp
#include <iostream>
#include <string>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

static const std::string kErc20TokenAddress = "0x784f0c076CC55EAD0a585a9A13e57c467c91Dc3a";

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;

    const std::string recipient = data.get("metadata").get("msg_sender").get<std::string>();
    const std::string call_data =
        std::string("0xa9059cbb")
        + "000000000000000000000000" + recipient.substr(2)
        + "000000000000000000000000000000000000000000000000000000000000000a";

    picojson::object voucher;
    voucher["destination"] = picojson::value(kErc20TokenAddress);
    voucher["payload"] = picojson::value(call_data);
    voucher["value"] = picojson::value("0x00");

    auto response = cli.Post(
        "/voucher",
        picojson::value(voucher).serialize(),
        "application/json"
    );

    if (!response || response->status >= 400)
    {
        std::cout << "Failed to send voucher" << std::endl;
        return "reject";
    }

    return "accept";
}
```
