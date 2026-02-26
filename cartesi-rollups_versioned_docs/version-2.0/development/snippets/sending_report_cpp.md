```cpp
#include <iostream>
#include <string>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

// Minimal helper to emit a report payload.
static bool emit_report(httplib::Client &cli, const std::string &message)
{
    picojson::object report;
    // Keep report payload hex-encoded using your template helper.
    report["payload"] = picojson::value(string_to_hex(message));
    const std::string body = picojson::value(report).serialize();

    auto response = cli.Post("/report", body, "application/json");
    return response && response->status < 400;
}

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    try
    {
        // Example operation that may fail: decode payload.
        const std::string payload_hex = data.get("payload").get<std::string>();
        (void)hex_to_string(payload_hex);
    }
    catch (const std::exception &e)
    {
        emit_report(cli, std::string("Error: ") + e.what());
        return "reject";
    }

    return "accept";
}
```
