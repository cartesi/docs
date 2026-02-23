```cpp
#include <iostream>
#include <string>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

static const std::string kZeroHash32 =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;

    // Sample withdrawal: send 1 ETH (in wei) back to msg_sender.
    const std::string recipient = data.get("metadata").get("msg_sender").get<std::string>();
    const std::string one_eth_wei_hex = "de0b6b3a7640000";

    picojson::object voucher;
    voucher["destination"] = picojson::value(recipient);
    voucher["payload"] = picojson::value(kZeroHash32);
    voucher["value"] = picojson::value(one_eth_wei_hex);

    auto response = cli.Post(
        "/voucher",
        picojson::value(voucher).serialize(),
        "application/json"
    );
    if (!response || response->status >= 400)
    {
        std::cout << "Failed to send Ether voucher" << std::endl;
        return "reject";
    }

    return "accept";
}
```
