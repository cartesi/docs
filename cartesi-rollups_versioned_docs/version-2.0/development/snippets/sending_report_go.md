```go
package main

import (
	"dapp/rollups"
	"fmt"
)

// HandleAdvance demonstrates minimal report emission on error.
func HandleAdvance(data *rollups.AdvanceResponse) error {
	// Example operation that may fail: decode payload.
	if _, err := rollups.Hex2Str(data.Payload); err != nil {
		// Keep report payload hex-encoded.
		report := rollups.ReportRequest{
			Payload: rollups.Str2Hex(fmt.Sprintf("Error: %v", err)),
		}
		if _, sendErr := rollups.SendReport(&report); sendErr != nil {
			return fmt.Errorf("HandleAdvance: failed sending report: %w", sendErr)
		}
		return fmt.Errorf("HandleAdvance: rejected due to app error: %w", err)
	}

	return nil
}
```
