# Inspecting and reading outputs

## Inspecting state

Inspecting the state of your dApp through `handle_inspect` function is done in the same way as using Cartesi Rollups v2. To perform an Inspect call, use an HTTP POST request to URL   `<node-address>/inspect/<app-address>/<payload>`. 

For example, using `curl` in a local environment:

```bash
curl -X POST http://localhost:8080/inspect/0x75135d8ADb7180640d29d822D9AD59E83E8695b2 \
     -H "Content-Type: application/json" \
     -d 'hello'
```
A typical inspect response is a JSON object with the following fields:

```json
{
  "exception_payload": "0x",
  "processed_input_count": 0,
  "reports": [
    {
      "payload": "hex-encoded-output-string"
    }
  ],
  "status": "Accepted"
}
```

## Querying outputs

Querying outputs via graphql is similar to using Cartesi Rollups v2.

The graphql endpoint is available at `<node-address>/graphql/<app-address>`.


We query outputs through an `id` field. This id field can come in two ways:

- It is a hex value returned from `/submit` endpoint when the input comes from and EIP-712 signed message
- It is string containing a scalar integer value that can be found inside the events emitted by the `inputBox` contract when sending the transaction through the layer 1.

### Example Queries

#### Listing inputs

```graphql
query {
  inputs(first: 30) {
    edges {
      node {
        id
        index
        status
        blockTimestamp
        msgSender
        payload
      }
    }
  }
}
```

#### Getting a specific input through its `id`

```graphql
query {
  input(id: "<input-id>") {
    id
    index
    status
    blockTimestamp
    msgSender
    payload
    notices {
      edges {
        node {
          payload
        }
      }
    }
    reports {
      edges {
        node {
          payload
        }
      }
    }
    vouchers {
      edges {
        node {
          payload
        }
      }
    }
  }
}
```
