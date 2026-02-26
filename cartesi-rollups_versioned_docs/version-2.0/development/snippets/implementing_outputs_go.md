```go
package main

import (
	"dapp/rollups"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/big"
	"os"
	"strconv"
	"strings"
)

var (
	infolog = log.New(os.Stderr, "[ info ]  ", log.Lshortfile)
	errlog  = log.New(os.Stderr, "[ error ] ", log.Lshortfile)
)

const (
	tokenAddress      = "0x1111111111111111111111111111111111111111"
	transferReceiver  = "0x2222222222222222222222222222222222222222"
	transferAmountWEI = "1000000000000000000"
)

func leftPad64(hexValue string) string {
	if len(hexValue) >= 64 {
		return hexValue
	}
	return strings.Repeat("0", 64-len(hexValue)) + hexValue
}

// encodeERC20Transfer creates calldata for transfer(address,uint256).
func encodeERC20Transfer(receiver string, amountWei string) (string, error) {
	to := strings.ToLower(strings.TrimPrefix(receiver, "0x"))
	if len(to) != 40 {
		return "", fmt.Errorf("invalid receiver address: %s", receiver)
	}

	amount := new(big.Int)
	if _, ok := amount.SetString(amountWei, 10); !ok || amount.Sign() < 0 {
		return "", fmt.Errorf("invalid transfer amount: %s", amountWei)
	}

	// Function selector for transfer(address,uint256) is a9059cbb.
	return "0xa9059cbb" + leftPad64(to) + leftPad64(amount.Text(16)), nil
}

func HandleAdvance(data *rollups.AdvanceResponse) error {
	dataMarshal, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("HandleAdvance: failed marshaling json: %w", err)
	}
	infolog.Println("Received advance request data", string(dataMarshal))

	// Publish input payload as a notice.
	notice := rollups.NoticeRequest{Payload: data.Payload}
	if _, err = rollups.SendNotice(&notice); err != nil {
		return fmt.Errorf("HandleAdvance: failed sending notice: %w", err)
	}

	// Publish input payload as a report.
	report := rollups.ReportRequest{Payload: data.Payload}
	if _, err = rollups.SendReport(&report); err != nil {
		return fmt.Errorf("HandleAdvance: failed sending report: %w", err)
	}

	// Build an ERC-20 transfer voucher.
	voucherPayload, err := encodeERC20Transfer(transferReceiver, transferAmountWEI)
	if err != nil {
		return fmt.Errorf("HandleAdvance: failed building voucher payload: %w", err)
	}
	voucher := rollups.VoucherRequest{
		Destination: tokenAddress,
		Value:       "0x00",
		Payload:     voucherPayload,
	}
	if _, err = rollups.SendVoucher(&voucher); err != nil {
		return fmt.Errorf("HandleAdvance: failed sending voucher: %w", err)
	}

	return nil
}

func HandleInspect(data *rollups.InspectResponse) error {
	dataMarshal, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("HandleInspect: failed marshaling json: %w", err)
	}
	infolog.Println("Received inspect request data", string(dataMarshal))
	return nil
}

func Handler(response *rollups.FinishResponse) error {
	var err error

	switch response.Type {
	case "advance_state":
		data := new(rollups.AdvanceResponse)
		if err = json.Unmarshal(response.Data, data); err != nil {
			return fmt.Errorf("Handler: Error unmarshaling advance: %w", err)
		}
		err = HandleAdvance(data)
	case "inspect_state":
		data := new(rollups.InspectResponse)
		if err = json.Unmarshal(response.Data, data); err != nil {
			return fmt.Errorf("Handler: Error unmarshaling inspect: %w", err)
		}
		err = HandleInspect(data)
	}
	return err
}

func main() {
	finish := rollups.FinishRequest{Status: "accept"}

	for {
		infolog.Println("Sending finish")
		res, err := rollups.SendFinish(&finish)
		if err != nil {
			errlog.Panicln("Error: error making http request: ", err)
		}
		infolog.Println("Received finish status ", strconv.Itoa(res.StatusCode))

		if res.StatusCode == 202 {
			infolog.Println("No pending rollup request, trying again")
		} else {

			resBody, err := io.ReadAll(res.Body)
			if err != nil {
				errlog.Panicln("Error: could not read response body: ", err)
			}

			var response rollups.FinishResponse
			err = json.Unmarshal(resBody, &response)
			if err != nil {
				errlog.Panicln("Error: unmarshaling body:", err)
			}

			finish.Status = "accept"
			err = Handler(&response)
			if err != nil {
				errlog.Println(err)
				finish.Status = "reject"
			}
		}
	}
}
```