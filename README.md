# Wait For Endpoint GitHub Action

This action polls a specified HTTP or HTTPS endpoint until it responds with the expected status code or the timeout is exceeded.

This action can be particularly useful to check the status of a container launched with the `-d` flag as part of a CI workflow.

## Inputs

### `url`

**Required** The URL to poll.

### `method`

**Required** The HTTP method to use. Default `"GET"`.

### `expected-status`

**Required** The HTTP status that is expected. Default `"200"`.

### `timeout`

**Required** The maximum time the polling is allowed to run for (in milliseconds). Default `"60000"`.

### `interval`

**Required** The interval at which the polling should happen (in milliseconds). Default `"1000"`.

## Example usage

```yml
uses: emilioschepis/wait-for-endpoint@v1.0.0
with:
  url: http://localhost:8080
  method: GET
  expected-status: 200
  timeout: 60000
  interval: 1000
```
