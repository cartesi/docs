```cpp
#include <stdexcept>
#include <string>
#include <vector>

struct Erc20Deposit
{
    std::string token;
    std::string sender;
    std::string amount_hex;
    std::vector<uint8_t> exec_layer_data;
};

std::vector<uint8_t> hex_to_bytes(const std::string &payload_hex)
{
    std::string payload = payload_hex;
    if (payload.rfind("0x", 0) == 0)
    {
        payload = payload.substr(2);
    }
    if (payload.size() % 2 != 0)
    {
        throw std::runtime_error("invalid hex payload length");
    }

    std::vector<uint8_t> out;
    out.reserve(payload.size() / 2);
    for (size_t i = 0; i < payload.size(); i += 2)
    {
        out.push_back(static_cast<uint8_t>(std::stoul(payload.substr(i, 2), nullptr, 16)));
    }
    return out;
}

std::string bytes_to_hex(const std::vector<uint8_t> &bytes, size_t start, size_t end)
{
    static const char *kHex = "0123456789abcdef";
    std::string out = "0x";
    out.reserve((end - start) * 2 + 2);
    for (size_t i = start; i < end; ++i)
    {
        out.push_back(kHex[(bytes[i] >> 4) & 0x0F]);
        out.push_back(kHex[bytes[i] & 0x0F]);
    }
    return out;
}

Erc20Deposit decode_erc20_deposit(const std::string &payload_hex)
{
    const auto raw = hex_to_bytes(payload_hex);

    // token(20) + sender(20) + amount(32) = 72 bytes
    if (raw.size() < 72)
    {
        throw std::runtime_error("invalid ERC-20 deposit payload");
    }

    Erc20Deposit out;
    out.token = bytes_to_hex(raw, 0, 20);
    out.sender = bytes_to_hex(raw, 20, 40);
    out.amount_hex = bytes_to_hex(raw, 40, 72);
    out.exec_layer_data = std::vector<uint8_t>(raw.begin() + 72, raw.end());
    return out;
}
```
