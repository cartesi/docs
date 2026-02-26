```cpp
#include <iostream>
#include <map>
#include <string>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

class Counter
{
public:
    Counter() : value_(0) {}

    int increment()
    {
        ++value_;
        return value_;
    }

    int get() const
    {
        return value_;
    }

private:
    int value_;
};

Counter counter;

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;
    const int new_value = counter.increment();
    std::cout << "Counter increment requested, new count value: " << new_value << std::endl;
    return "accept";
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received inspect request data " << data << std::endl;
    std::cout << "Current counter value: " << counter.get() << std::endl;
    return "accept";
}

int main(int argc, char **argv)
{
    std::map<std::string, decltype(&handle_advance)> handlers = {
        {std::string("advance_state"), &handle_advance},
        {std::string("inspect_state"), &handle_inspect},
    };

    httplib::Client cli(getenv("ROLLUP_HTTP_SERVER_URL"));
    std::string status = "accept";

    while (true)
    {
        std::cout << "Sending finish" << std::endl;
        auto finish = std::string("{\"status\":\"") + status + std::string("\"}");
        auto response = cli.Post("/finish", finish, "application/json");
        if (!response)
        {
            std::cout << "Failed to call /finish" << std::endl;
            status = "reject";
            continue;
        }

        std::cout << "Received finish status " << response->status << std::endl;
        if (response->status == 202)
        {
            std::cout << "No pending rollup request, trying again" << std::endl;
            status = "accept";
            continue;
        }

        picojson::value rollup_request;
        picojson::parse(rollup_request, response->body);
        auto request_type = rollup_request.get("request_type").get<std::string>();
        auto data = rollup_request.get("data");
        status = handlers.find(request_type)->second(cli, data);
    }
}
```
