```go
package main

import (
	"encoding/json"
	"fmt"
	"math/big"
	"strings"

	"dapp/rollups"
)

// Empty payload: a plain Ether transfer must not carry calldata.
const emptyPayload = "0x"

type EtherWithdrawCommand struct {
	AmountWei string `json:"amount_wei"`
	Recipient string `json:"recipient"`
}

func emitEtherVoucher(recipient string, amountWei *big.Int) error {
	voucher := rollups.VoucherRequest{
		Destination: strings.ToLower(strings.TrimSpace(recipient)),
		Payload:     emptyPayload,
		Value:       fmt.Sprintf("0x%064x", amountWei), // 0x-prefixed, 32 bytes
	}
	_, err := rollups.SendVoucher(&voucher)
	return err
}

func HandleAdvance(data *rollups.AdvanceResponse) error {
	decoded, err := rollups.Hex2Str(data.Payload)
	if err != nil {
		return fmt.Errorf("HandleAdvance: failed to decode payload: %w", err)
	}

	var cmd EtherWithdrawCommand
	if err := json.Unmarshal([]byte(decoded), &cmd); err != nil {
		return fmt.Errorf("HandleAdvance: invalid payload JSON: %w", err)
	}

	amountWei, ok := new(big.Int).SetString(cmd.AmountWei, 10)
	if !ok {
		return fmt.Errorf("HandleAdvance: invalid amount_wei")
	}

	recipient := cmd.Recipient
	if recipient == "" {
		recipient = data.Metadata.MsgSender
	}

	if err := emitEtherVoucher(recipient, amountWei); err != nil {
		return fmt.Errorf("HandleAdvance: failed sending voucher: %w", err)
	}
	return nil
}
```
