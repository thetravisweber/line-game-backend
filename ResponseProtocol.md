# Response protocol

## Incoming

"b" - buy order

"s" - sell order

any JSON is used to set user settings / metadata

```(JSON)
{
    setting_name: new_value
}
```

## outgoing

### Root message

p - current price
s - user personal score
l - leaderboard
n - username
