# magpie-workbuddy-responses

Magpie gateway middleware for WorkBuddy Responses API:

1. **`onRequest`**: strips the `@responses` suffix from `body.model` (e.g. `copilot/gpt-6.2-sol@responses` -> `copilot/gpt-6.2-sol`) so custom Responses entries in `~/.workbuddy/models.json` keep unique IDs without colliding with magpie-managed Chat entries.
2. **`onEvent` / `onResponse`**: strips non-numeric fields (such as `cache_write_tokens_details`) from `usage.input_tokens_details` and `usage.output_tokens_details` on Responses API replies so WorkBuddy's Zod validator accepts them.

## Install

```bash
magpie plugin add github:MountainHigh168/magpie-workbuddy-responses
```
