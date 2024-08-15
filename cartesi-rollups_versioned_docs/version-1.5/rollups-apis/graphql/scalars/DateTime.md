---
id: date-time
title: DateTime
hide_table_of_contents: false
---


The `DateTime` scalar type represents a point in time, expressed as the number of seconds that have elapsed since the Unix epoch (January 1, 1970, at 00:00:00 UTC), not counting leap seconds. This is also known as Unix time, POSIX time, or Epoch time.

```graphql
scalar DateTime
```

Format: Integer representing seconds since the Unix epoch

Example: `1723746395` (represents August 15, 2024, 00:59:55 UTC)