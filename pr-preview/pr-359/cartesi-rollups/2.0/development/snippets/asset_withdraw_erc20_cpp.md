> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

```cpp
#include <iostream>
#include <string>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

static const std::string kErc20TokenAddress = "0x86EA17052C8e335Ad830B54EF566274EAB46B852";

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
    voucher["value"] = picojson::value("0x" + std::string(64, '0')); // 32-byte hex string: no Ether sent

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
