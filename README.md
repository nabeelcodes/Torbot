# TorBox Telegram Bot

Deploys a TypeScript Telegram webhook on Cloudflare Workers. Accepts magnet links and adds them to TorBox. Powered by Hono + CF Workers + TypeScript.

## Setup

1. Create bot with BotFather and get `TELEGRAM_TOKEN`.
2. Get `TORBOX_API_KEY` from TorBox.
3. Install dependencies:

```bash
pnpm install
```

## Stack

- **Runtime** : Cloudflare Workers

- **Framework** : Hono (TS-first, Express-style)

- **Type Checking** : Zod for API validation

- **Deployment** : wrangler CLI

- **Bot Architecture** : Telegram Webhook (not polling)

- **TorBox API Calls** : fetch with Bearer auth

- **Secrets** : Wrangler’s vars (wrangler secret put TELEGRAM_TOKEN)
