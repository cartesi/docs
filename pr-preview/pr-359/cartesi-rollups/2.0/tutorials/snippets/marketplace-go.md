> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

```go
package main

import (
	"dapp/rollups"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/big"
	"net/http"
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

	ListedTokens            []string // token IDs in decimal, in listing order
	Erc721OwnerByTokenID    map[string]string
	UserErc20BalanceByUser  map[string]*big.Int
	UserOwnedTokenIDsByUser map[string][]string
}

func newMarketplace() *Marketplace {
	return &Marketplace{
		ERC721Portal: normAddr("0x397c352d18DFf47CC8a6143403142cf7afd5Ff7E"),
		ERC20Portal:  normAddr("0x3332DE61a8BB9aC84893b2f552Fe81C9a6dC5419"),
		ERC721Token:  normAddr("0x0761b8e3aB06F458632974393C48765E6Ddc61bB"),
		ERC20Token:   normAddr("0x86EA17052C8e335Ad830B54EF566274EAB46B852"),
		AppAddress:   zeroAddress,
		ListPriceWei: new(big.Int).Mul(big.NewInt(100), new(big.Int).Exp(big.NewInt(10), big.NewInt(18), nil)), // 100 tokens (18 decimals)

		ListedTokens:            []string{},
		Erc721OwnerByTokenID:    map[string]string{},
		UserErc20BalanceByUser:  map[string]*big.Int{},
		UserOwnedTokenIDsByUser: map[string][]string{},
	}
}

func normAddr(a string) string {
	return strings.ToLower(strings.TrimSpace(a))
}

func parseDepositPayload(payloadHex string) (token string, receiver string, amount *big.Int, err error) {
	// ERC-20 and ERC-721 deposits start with the same packed fields:
	// token (20 bytes), sender (20 bytes), amount or token ID (32 bytes)
	payloadHex = strings.TrimPrefix(payloadHex, "0x")
	raw, err := hex.DecodeString(payloadHex)
	if err != nil {
		return "", "", nil, fmt.Errorf("invalid hex payload: %w", err)
	}
	if len(raw) < 72 {
		return "", "", nil, fmt.Errorf("payload too short: %d bytes", len(raw))
	}
	token = "0x" + hex.EncodeToString(raw[0:20])
	receiver = "0x" + hex.EncodeToString(raw[20:40])
	amount = new(big.Int).SetBytes(raw[40:72])
	return token, receiver, amount, nil
}

// parseTokenID accepts a decimal or a 0x-prefixed hex string and returns the ID in decimal
func parseTokenID(value string) (string, error) {
	id, ok := new(big.Int), false
	if strings.HasPrefix(value, "0x") || strings.HasPrefix(value, "0X") {
		_, ok = id.SetString(value[2:], 16)
	} else {
		_, ok = id.SetString(value, 10)
	}
	if !ok || id.Sign() < 0 {
		return "", fmt.Errorf("Cannot convert %s to an integer", value)
	}
	return id.String(), nil
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

func (m *Marketplace) isListed(tokenID string) bool {
	for _, id := range m.ListedTokens {
		if id == tokenID {
			return true
		}
	}
	return false
}

func (m *Marketplace) unlist(tokenID string) {
	kept := []string{}
	for _, id := range m.ListedTokens {
		if id != tokenID {
			kept = append(kept, id)
		}
	}
	m.ListedTokens = kept
}

func (m *Marketplace) increaseUserBalance(user string, amount *big.Int) {
	addr := normAddr(user)
	if _, ok := m.UserErc20BalanceByUser[addr]; !ok {
		m.UserErc20BalanceByUser[addr] = big.NewInt(0)
	}
	m.UserErc20BalanceByUser[addr].Add(m.UserErc20BalanceByUser[addr], amount)
}

func (m *Marketplace) reduceUserBalance(user string, amount *big.Int) error {
	addr := normAddr(user)
	bal, ok := m.UserErc20BalanceByUser[addr]
	if !ok || bal.Cmp(amount) < 0 {
		return fmt.Errorf("User %s has insufficient balance", addr)
	}
	bal.Sub(bal, amount)
	return nil
}

func (m *Marketplace) depositErc721(user, tokenID string) {
	addr := normAddr(user)
	m.Erc721OwnerByTokenID[tokenID] = addr
	m.UserOwnedTokenIDsByUser[addr] = append(m.UserOwnedTokenIDsByUser[addr], tokenID)
	if !m.isListed(tokenID) {
		m.ListedTokens = append(m.ListedTokens, tokenID)
	}
}

type UserCommand struct {
	Method  string `json:"method"`
	TokenID any    `json:"token_id"`
}

var storage = newMarketplace()

// checkOutput turns a failed /notice, /report or /voucher request into an error
func checkOutput(res *http.Response, err error, kind string) error {
	if err != nil {
		return fmt.Errorf("Failed to generate %s: %w", kind, err)
	}
	defer res.Body.Close()
	if res.StatusCode >= 400 {
		return fmt.Errorf("Failed to generate %s: HTTP %d", kind, res.StatusCode)
	}
	return nil
}

func sendNotice(text string) error {
	res, err := rollups.SendNotice(&rollups.NoticeRequest{Payload: rollups.Str2Hex(text)})
	return checkOutput(res, err, "notice")
}

func sendReport(text string) {
	res, err := rollups.SendReport(&rollups.ReportRequest{Payload: rollups.Str2Hex(text)})
	if err = checkOutput(res, err, "report"); err != nil {
		errlog.Println(err)
	}
}

func handlePurchaseToken(buyer string, cmd UserCommand) error {
	idText, ok := cmd.TokenID.(string)
	if !ok || strings.TrimSpace(idText) == "" {
		return errors.New("Missing or invalid token_id field in payload")
	}
	tokenID, err := parseTokenID(strings.TrimSpace(idText))
	if err != nil {
		return err
	}
	if !storage.isListed(tokenID) {
		return fmt.Errorf("Token %s with id %s is not for sale", storage.ERC721Token, tokenID)
	}
	seller, ok := storage.Erc721OwnerByTokenID[tokenID]
	if !ok {
		return fmt.Errorf("Token owner for token %s with id %s not found", storage.ERC721Token, tokenID)
	}

	if err := storage.reduceUserBalance(buyer, storage.ListPriceWei); err != nil {
		return err
	}
	storage.increaseUserBalance(seller, storage.ListPriceWei)
	// the NFT leaves the marketplace with the voucher below
	storage.Erc721OwnerByTokenID[tokenID] = zeroAddress
	storage.unlist(tokenID)
	infolog.Println("Token purchased successfully")

	// The application contract holds the deposited NFTs and executes the
	// voucher, so it is the `from` address of the transfer
	voucher := rollups.VoucherRequest{
		Destination: storage.ERC721Token,
		Payload:     encodeTransferFrom(storage.AppAddress, buyer, tokenID),
		Value:       "0x" + strings.Repeat("0", 64), // 32-byte hex string: no Ether sent with the call
	}
	res, err := rollups.SendVoucher(&voucher)
	if err = checkOutput(res, err, "voucher"); err != nil {
		return err
	}
	infolog.Println("Voucher generation successful")
	return nil
}

func HandleAdvance(data *rollups.AdvanceResponse) error {
	infolog.Printf("Received advance request data %+v\n", data)
	sender := normAddr(data.Metadata.MsgSender)
	if storage.AppAddress == zeroAddress {
		storage.AppAddress = normAddr(data.Metadata.AppContract)
	}

	if sender == storage.ERC20Portal {
		token, receiver, amount, err := parseDepositPayload(data.Payload)
		if err != nil {
			return err
		}
		if normAddr(token) != storage.ERC20Token {
			return errors.New("Unsupported token deposited")
		}
		storage.increaseUserBalance(receiver, amount)
		infolog.Println("Token deposit processed successfully")
		return nil
	}

	if sender == storage.ERC721Portal {
		token, receiver, tokenID, err := parseDepositPayload(data.Payload)
		if err != nil {
			return err
		}
		if normAddr(token) != storage.ERC721Token {
			return errors.New("Unsupported token deposited")
		}
		storage.depositErc721(receiver, tokenID.String())
		infolog.Println("Token deposit and listing processed successfully")
		return sendNotice(fmt.Sprintf("Token ID: %s Deposited by User: %s", tokenID.String(), receiver))
	}

	var cmd UserCommand
	decoded, err := rollups.Hex2Str(data.Payload)
	if err != nil || json.Unmarshal([]byte(decoded), &cmd) != nil {
		return errors.New("Invalid payload JSON")
	}
	if cmd.Method != "purchase_token" {
		return errors.New("Unsupported method called!!")
	}
	return handlePurchaseToken(sender, cmd)
}

func HandleInspect(data *rollups.InspectResponse) error {
	infolog.Printf("Received inspect request data %+v\n", data)
	decoded, _ := rollups.Hex2Str(data.Payload)

	var cmd map[string]any
	decoder := json.NewDecoder(strings.NewReader(decoded))
	decoder.UseNumber() // keep numeric token IDs exact
	if err := decoder.Decode(&cmd); err != nil {
		sendReport("Invalid payload JSON")
		return nil
	}

	method, _ := cmd["method"].(string)
	switch method {
	case "get_user_erc20_balance":
		user, _ := cmd["user_address"].(string)
		bal := big.NewInt(0)
		if v, ok := storage.UserErc20BalanceByUser[normAddr(user)]; ok {
			bal = v
		}
		sendReport(fmt.Sprintf("User: %s Balance: %s", user, bal.String()))
	case "get_token_owner":
		// the token ID can be a JSON number or a string
		tokenID, err := parseTokenID(fmt.Sprint(cmd["token_id"]))
		if err != nil {
			return err
		}
		owner, ok := storage.Erc721OwnerByTokenID[tokenID]
		if !ok {
			owner = "None"
		}
		sendReport(fmt.Sprintf("Token_id: %s owner: %s", tokenID, owner))
	case "get_all_listed_tokens":
		sendReport("All listed tokens are: " + strings.Join(storage.ListedTokens, ","))
	default:
		infolog.Println("Unsupported method called!!")
		sendReport("Unsupported inspect method")
	}
	return nil
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

		var response rollups.FinishResponse
		if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
			errlog.Panicln("Error parsing finish response:", err)
		}

		var handlerErr error
		if response.Type == "advance_state" {
			data := new(rollups.AdvanceResponse)
			_ = json.Unmarshal(response.Data, data)
			handlerErr = HandleAdvance(data)
		} else if response.Type == "inspect_state" {
			data := new(rollups.InspectResponse)
			_ = json.Unmarshal(response.Data, data)
			handlerErr = HandleInspect(data)
		}

		finish.Status = "accept"
		if handlerErr != nil {
			// invalid requests are rejected with a report: they never stop the application
			errlog.Println(handlerErr)
			sendReport(handlerErr.Error())
			finish.Status = "reject"
		}
	}
}
```
