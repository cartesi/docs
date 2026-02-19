```go
package main

import (
	"dapp/rollups"
	"fmt"
	"strconv"
	"strings"
)

// calculateMultiples returns the first 5 multiples as: "n, 2n, 3n, 4n, 5n".
func calculateMultiples(num int64) string {
	parts := make([]string, 0, 5)
	for i := int64(1); i <= 5; i++ {
		parts = append(parts, strconv.FormatInt(num*i, 10))
	}
	return strings.Join(parts, ", ")
}

// HandleAdvance parses an integer input and emits a notice with its first 5 multiples.
func HandleAdvance(data *rollups.AdvanceResponse) error {
	// Payload is hex-encoded text, expected to contain a decimal integer (example: "7").
	input, err := rollups.Hex2Str(data.Payload)
	if err != nil {
		return fmt.Errorf("HandleAdvance: invalid payload encoding: %w", err)
	}
	input = strings.TrimSpace(input)

	value, err := strconv.ParseInt(input, 10, 64)
	if err != nil {
		return fmt.Errorf("HandleAdvance: invalid integer payload %q: %w", input, err)
	}

	// Compute result and publish as a notice payload.
	result := calculateMultiples(value)
	notice := rollups.NoticeRequest{Payload: rollups.Str2Hex(result)}
	if _, err = rollups.SendNotice(&notice); err != nil {
		return fmt.Errorf("HandleAdvance: failed sending notice: %w", err)
	}

	return nil
}
```