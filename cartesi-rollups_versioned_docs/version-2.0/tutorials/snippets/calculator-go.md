```go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"dapp/rollups"
	"github.com/Knetic/govaluate"
)

var (
	infolog = log.New(os.Stderr, "[ info ]  ", log.Lshortfile)
	errlog  = log.New(os.Stderr, "[ error ] ", log.Lshortfile)
)

func HandleAdvance(data *rollups.AdvanceResponse) error {
	infolog.Printf("Received advance request data %+v\n", data)

	expression, err := rollups.Hex2Str(data.Payload)
	if err != nil {
		report := rollups.ReportRequest{Payload: rollups.Str2Hex(fmt.Sprintf("decode error: %v", err))}
		_, _ = rollups.SendReport(&report)
		return err
	}

	evaluable, err := govaluate.NewEvaluableExpression(expression)
	if err != nil {
		report := rollups.ReportRequest{Payload: rollups.Str2Hex(fmt.Sprintf("parse error: %v", err))}
		_, _ = rollups.SendReport(&report)
		return err
	}

	result, err := evaluable.Evaluate(nil)
	if err != nil {
		report := rollups.ReportRequest{Payload: rollups.Str2Hex(fmt.Sprintf("evaluation error: %v", err))}
		_, _ = rollups.SendReport(&report)
		return err
	}

	notice := rollups.NoticeRequest{Payload: rollups.Str2Hex(fmt.Sprintf("%v", result))}
	_, err = rollups.SendNotice(&notice)
	return err
}

func HandleInspect(data *rollups.InspectResponse) error {
	infolog.Printf("Received inspect request data %+v\n", data)
	report := rollups.ReportRequest{Payload: data.Payload}
	_, err := rollups.SendReport(&report)
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
				finish.Status = "reject"
			}
		} else if response.Type == "inspect_state" {
			data := new(rollups.InspectResponse)
			_ = json.Unmarshal(response.Data, data)
			if err = HandleInspect(data); err != nil {
				finish.Status = "reject"
			}
		}
	}
}
```
