```rust
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IInputBox {
    function addInput(address appContract, bytes calldata payload) external returns (bytes32);
}

contract InputRelayer {
    struct RelayRecord {
        address destination;
        address inputBox;
        bytes inputBody;
        bytes32 inputHash;
        uint256 timestamp;
    }

    RelayRecord[] private _records;

    function relayInput(
        address destination,
        address input_box,
        bytes calldata input_body
    ) external returns (bytes32) {
        bytes32 inputHash = IInputBox(input_box).addInput(destination, input_body);

        _records.push(RelayRecord({
            destination: destination,
            inputBox: input_box,
            inputBody: input_body,
            inputHash: inputHash,
            timestamp: block.timestamp
        }));

        return inputHash;
    }

    function getRecordCount() external view returns (uint256) {
        return _records.length;
    }

    function getRecord(uint256 index) external view returns (RelayRecord memory) {
        require(index < _records.length, "InputRelayer: index out of bounds");
        return _records[index];
    }

    function getAllRecords() external view returns (RelayRecord[] memory) {
        return _records;
    }

    function getRecordsByDestination(address destination) external view returns (RelayRecord[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < _records.length; i++) {
            if (_records[i].destination == destination) count++;
        }

        RelayRecord[] memory result = new RelayRecord[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < _records.length; i++) {
            if (_records[i].destination == destination) {
                result[j++] = _records[i];
            }
        }
        return result;
    }
}
```
