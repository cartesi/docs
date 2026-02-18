```cpp
#include <sstream>
#include <string>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

// Build a comma-separated string with the first 5 multiples of num.
std::string calculate_multiples(long long num)
{
    std::ostringstream result;
    for (int i = 1; i <= 5; ++i)
    {
        result << (num * i);
        if (i < 5)
        {
            result << ", ";
        }
    }
    return result.str();
}

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;

    try
    {
        // Use your template helper to decode hex payload into UTF-8 text.
        // Example helper in Cartesi templates: hex_to_string("0x32") -> "2"
        const std::string payload_hex = data.get("payload").get<std::string>();
        const std::string input = hex_to_string(payload_hex);

        // 2) Parse number, compute multiples.
        const long long value = std::stoll(input);
        const std::string multiples = calculate_multiples(value);

        std::cout << "Adding notice with value " << multiples << std::endl;

        // 3) Build and emit notice to the rollup server.
        picojson::object notice;
        // Use your template helper to encode UTF-8 text into hex.
        // Example helper: string_to_hex("2, 4, 6, 8, 10")
        notice["payload"] = picojson::value(string_to_hex(multiples));
        const std::string body = picojson::value(notice).serialize();

        auto response = cli.Post("/notice", body, "application/json");
        if (!response || response->status >= 400)
        {
            std::cerr << "Failed to send notice" << std::endl;
        }
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error in handle_advance: " << e.what() << std::endl;
    }

    return "accept";
}

// ... rest of the Cartesi app code (finish loop, routing, and startup)
```
