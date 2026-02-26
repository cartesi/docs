```go
package main

import (
	"encoding/hex"
	"fmt"
	"math/big"
	"strings"
)

type Erc20Deposit struct {
	Token         string
	Sender        string
	Amount        *big.Int
	ExecLayerData []byte
}

func DecodeErc20Deposit(payloadHex string) (*Erc20Deposit, error) {
	payload := strings.TrimPrefix(payloadHex, "0x")
	raw, err := hex.DecodeString(payload)
	if err != nil {
		return nil, fmt.Errorf("invalid hex payload: %w", err)
	}

	// token(20) + sender(20) + amount(32) = 72 bytes
	if len(raw) < 72 {
		return nil, fmt.Errorf("invalid ERC-20 deposit payload")
	}

	return &Erc20Deposit{
		Token:         "0x" + hex.EncodeToString(raw[0:20]),
		Sender:        "0x" + hex.EncodeToString(raw[20:40]),
		Amount:        new(big.Int).SetBytes(raw[40:72]),
		ExecLayerData: raw[72:],
	}, nil
}
```
