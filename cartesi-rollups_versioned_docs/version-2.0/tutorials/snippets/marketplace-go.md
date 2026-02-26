```go
package main

import (
	"dapp/rollups"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"os"
	"strings"
)

var (
	infolog = log.New(os.Stderr, "[ info ]  ", log.Lshortfile)
	errlog  = log.New(os.Stderr, "[ error ] ", log.Lshortfile)
)

const (
	zeroAddress = "0x0000000000000000000000000000000000000000"
)

type Marketplace struct {
	ERC721Portal string
	ERC20Portal  string
	ERC721Token  string
	ERC20Token   string
	AppAddress   string
	ListPriceWei *big.Int

	ListedTokens            map[string]bool
	Erc721OwnerByTokenID    map[string]string
	UserErc20BalanceByUser  map[string]*big.Int
	UserOwnedTokenIDsByUser map[string][]string
}

func newMarketplace() *Marketplace {
	return &Marketplace{
		ERC721Portal: "0x9E8851dadb2b77103928518846c4678d48b5e371",
		ERC20Portal:  "0xACA6586A0Cf05bD831f2501E7B4aea550dA6562D",
		ERC721Token:  "0x1c5AB37576Af4e6BEeCB66Fa6a9FdBc608F44B78",
		ERC20Token:   "0x5138f529B77B4e0a7c84B77E79c4335D31938fed",
		AppAddress:   zeroAddress,
		ListPriceWei: big.NewInt(0).SetUint64(100_000_000_000_000_000), // 100 tokens (18 decimals)

		ListedTokens:            map[string]bool{},
		Erc721OwnerByTokenID:    map[string]string{},
		UserErc20BalanceByUser:  map[string]*big.Int{},
		UserOwnedTokenIDsByUser: map[string][]string{},
	}
}

func normAddr(a string) string {
	return strings.ToLower(strings.TrimSpace(a))
}

func parseDepositPayload(payloadHex string) (token string, receiver string, amount *big.Int, err error) {
	payloadHex = strings.TrimPrefix(payloadHex, "0x")
	raw, err := hex.DecodeString(payloadHex)
	if err != nil {
		return "", "", nil, fmt.Errorf("invalid hex payload: %w", err)
	}
	if len(raw) < 72 {
		return "", "", nil, fmt.Errorf("payload too short")
	}
	token = "0x" + hex.EncodeToString(raw[0:20])
	receiver = "0x" + hex.EncodeToString(raw[20:40])
	amount = new(big.Int).SetBytes(raw[40:72])
	return token, receiver, amount, nil
}

func encodeTransferFrom(from, to, tokenID string) string {
	selector := "23b872dd" // transferFrom(address,address,uint256)
	fromWord := fmt.Sprintf("%064s", strings.TrimPrefix(normAddr(from), "0x"))
	toWord := fmt.Sprintf("%064s", strings.TrimPrefix(normAddr(to), "0x"))
	id := new(big.Int)
	id.SetString(tokenID, 10)
	idWord := fmt.Sprintf("%064x", id)
	return "0x" + selector + strings.ReplaceAll(fromWord, " ", "0") + strings.ReplaceAll(toWord, " ", "0") + idWord
}

func (m *Marketplace) increaseUserBalance(user string, amount *big.Int) {
	addr := normAddr(user)
	if _, ok := m.UserErc20BalanceByUser[addr]; !ok {
		m.UserErc20BalanceByUser[addr] = big.NewInt(0)
	}
	m.UserErc20BalanceByUser[addr].Add(m.UserErc20BalanceByUser[addr], amount)
}

func (m *Marketplace) reduceUserBalance(user string, amount *big.Int) bool {
	addr := normAddr(user)
	bal, ok := m.UserErc20BalanceByUser[addr]
	if !ok || bal.Cmp(amount) < 0 {
		return false
	}
	bal.Sub(bal, amount)
	return true
}

func (m *Marketplace) depositErc721(user, tokenID string) {
	addr := normAddr(user)
	m.Erc721OwnerByTokenID[tokenID] = addr
	m.UserOwnedTokenIDsByUser[addr] = append(m.UserOwnedTokenIDsByUser[addr], tokenID)
	m.ListedTokens[tokenID] = true
}

type UserCommand struct {
	Method  string      `json:"method"`
	TokenID json.Number `json:"token_id"`
}

var storage = newMarketplace()

func HandleAdvance(data *rollups.AdvanceResponse) error {
	infolog.Printf("Received advance request data %+v\n", data)
	sender := normAddr(data.Metadata.MsgSender)
	if normAddr(storage.AppAddress) == normAddr(zeroAddress) {
		storage.AppAddress = normAddr(data.Metadata.AppContract)
	}

	if sender == normAddr(storage.ERC20Portal) {
		token, receiver, amount, err := parseDepositPayload(data.Payload)
		if err != nil {
			return fmt.Errorf("HandleAdvance: parse ERC20 deposit failed: %w", err)
		}
		if normAddr(token) != normAddr(storage.ERC20Token) {
			return fmt.Errorf("HandleAdvance: unsupported ERC20 token")
		}
		storage.increaseUserBalance(receiver, amount)
		infolog.Println("Token deposit processed successfully")
		return nil
	}

	if sender == normAddr(storage.ERC721Portal) {
		token, receiver, amount, err := parseDepositPayload(data.Payload)
		if err != nil {
			return fmt.Errorf("HandleAdvance: parse ERC721 deposit failed: %w", err)
		}
		if normAddr(token) != normAddr(storage.ERC721Token) {
			return fmt.Errorf("HandleAdvance: unsupported ERC721 token")
		}
		storage.depositErc721(receiver, amount.String())
		notice := rollups.NoticeRequest{Payload: rollups.Str2Hex("Token listed successfully")}
		_, _ = rollups.SendNotice(&notice)
		infolog.Println("Token deposit and listing processed successfully")
		return nil
	}

	decoded, err := rollups.Hex2Str(data.Payload)
	if err != nil {
		return fmt.Errorf("HandleAdvance: invalid user payload: %w", err)
	}
	var cmd UserCommand
	if err := json.Unmarshal([]byte(decoded), &cmd); err != nil {
		return fmt.Errorf("HandleAdvance: invalid JSON payload: %w", err)
	}

	if cmd.Method != "purchase_token" {
		return fmt.Errorf("HandleAdvance: unsupported method")
	}
	tokenID := cmd.TokenID.String()
	if !storage.ListedTokens[tokenID] {
		return fmt.Errorf("HandleAdvance: token is not listed")
	}
	if !storage.reduceUserBalance(sender, storage.ListPriceWei) {
		return fmt.Errorf("HandleAdvance: insufficient buyer balance")
	}

	seller := storage.Erc721OwnerByTokenID[tokenID]
	storage.increaseUserBalance(seller, storage.ListPriceWei)
	delete(storage.ListedTokens, tokenID)
	storage.Erc721OwnerByTokenID[tokenID] = normAddr(sender)

	voucher := rollups.VoucherRequest{
		Destination: storage.ERC721Token,
		Payload:     encodeTransferFrom(storage.AppAddress, sender, tokenID),
		Value:       "0x00",
	}
	_, err = rollups.SendVoucher(&voucher)
	if err != nil {
		return fmt.Errorf("HandleAdvance: failed sending voucher: %w", err)
	}
	infolog.Println("Voucher generation successful")
	infolog.Println("Token purchased and Withdrawn successfully")
	return nil
}

func HandleInspect(data *rollups.InspectResponse) error {
	infolog.Printf("Received inspect request data %+v\n", data)
	decoded, err := rollups.Hex2Str(data.Payload)
	if err != nil {
		return fmt.Errorf("HandleInspect: invalid inspect payload: %w", err)
	}

	var cmd map[string]string
	if err := json.Unmarshal([]byte(decoded), &cmd); err != nil {
		return fmt.Errorf("HandleInspect: invalid inspect JSON: %w", err)
	}

	method := cmd["method"]
	var reportText string
	switch method {
	case "get_user_erc20_balance":
		addr := normAddr(cmd["user_address"])
		bal := big.NewInt(0)
		if v, ok := storage.UserErc20BalanceByUser[addr]; ok {
			bal = v
		}
		reportText = fmt.Sprintf("User: %s Balance: %s", addr, bal.String())
	case "get_token_owner":
		owner := storage.Erc721OwnerByTokenID[cmd["token_id"]]
		if owner == "" {
			owner = "None"
		}
		reportText = fmt.Sprintf("Token_id: %s owner: %s", cmd["token_id"], owner)
	default:
		list := make([]string, 0, len(storage.ListedTokens))
		for id := range storage.ListedTokens {
			list = append(list, id)
		}
		reportText = fmt.Sprintf("All listed tokens are: %s", strings.Join(list, ","))
	}

	report := rollups.ReportRequest{Payload: rollups.Str2Hex(reportText)}
	_, err = rollups.SendReport(&report)
	return err
}

func main() {
	finish := rollups.FinishRequest{Status: "accept"}

	for {
		infolog.Println("Sending finish")
		res, err := rollups.SendFinish(&finish)
		if err != nil {
			errlog.Panicln("Error calling /finish:", err)
		}

		if res.StatusCode == 202 {
			infolog.Println("No pending rollup request, trying again")
			continue
		}

		response, err := rollups.ParseFinishResponse(res)
		if err != nil {
			errlog.Panicln("Error parsing finish response:", err)
		}

		finish.Status = "accept"
		if response.Type == "advance_state" {
			data := new(rollups.AdvanceResponse)
			_ = json.Unmarshal(response.Data, data)
			if err = HandleAdvance(data); err != nil {
				errlog.Println(err)
				finish.Status = "reject"
			}
		} else if response.Type == "inspect_state" {
			data := new(rollups.InspectResponse)
			_ = json.Unmarshal(response.Data, data)
			if err = HandleInspect(data); err != nil {
				errlog.Println(err)
				finish.Status = "reject"
			}
		}
	}
}
```