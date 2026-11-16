> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

```go
package main

import (
	"dapp/rollups"
	"encoding/json"
	"io"
	"log"
	"os"
)

var (
	infolog = log.New(os.Stderr, "[ info ]  ", log.Lshortfile)
	errlog  = log.New(os.Stderr, "[ error ] ", log.Lshortfile)
)

type Counter struct {
	value int
}

func (c *Counter) Increment() int {
	c.value++
	return c.value
}

func (c *Counter) Get() int {
	return c.value
}

var counter = &Counter{}

func HandleAdvance(data *rollups.AdvanceResponse) error {
	infolog.Printf("Received advance request data %+v\n", data)
	newVal := counter.Increment()
	infolog.Printf("Counter increment requested, new count value: %d\n", newVal)
	return nil
}

func HandleInspect(data *rollups.InspectResponse) error {
	infolog.Printf("Received inspect request data %+v\n", data)
	infolog.Printf("Current counter value: %d\n", counter.Get())
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

		resBody, err := io.ReadAll(res.Body)
		if err != nil {
			errlog.Panicln("Error reading finish response:", err)
		}

		var response rollups.FinishResponse
		if err = json.Unmarshal(resBody, &response); err != nil {
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
		} else {
			finish.Status = "reject"
			errlog.Printf("Unknown request type: %s\n", response.Type)
		}
	}
}
```
