> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

```go
package main

import (
	"fmt"
	"strings"

	"dapp/rollups"
)

const erc20TokenAddress = "0x86EA17052C8e335Ad830B54EF566274EAB46B852"

func encodeErc20Transfer(recipient string, amount uint64) string {
	recipientHex := strings.TrimPrefix(strings.ToLower(strings.TrimSpace(recipient)), "0x")
	recipientPadded := fmt.Sprintf("%064s", recipientHex)
	recipientPadded = strings.ReplaceAll(recipientPadded, " ", "0")
	amountPadded := fmt.Sprintf("%064x", amount)
	return "0xa9059cbb" + recipientPadded + amountPadded
}

func HandleAdvance(data *rollups.AdvanceResponse) error {
	// In this example we transfer 10 tokens to the input sender.
	recipient := data.Metadata.MsgSender
	callData := encodeErc20Transfer(recipient, 10)

	voucher := rollups.VoucherRequest{
		Destination: erc20TokenAddress,
		Payload:     callData,
		Value:       "0x" + strings.Repeat("0", 64), // 32-byte hex string: no Ether sent
	}

	if _, err := rollups.SendVoucher(&voucher); err != nil {
		return fmt.Errorf("HandleAdvance: failed sending voucher: %w", err)
	}

	return nil
}
```
