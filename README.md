<p align="center"><img src="logo.png" alt="rawcord" width="160"></p>

# rawcord

A Discord bot template with **no Discord libraries**: raw Gateway (WebSocket), raw REST (`fetch`), and Node's built-in SQLite. Clone it, add your token, run it.

## Requirements

- Node.js with native TypeScript support and `--env-file` (Node 24+ recommended)
- A bot token from the [Discord Developer Portal](https://discord.com/developers/applications)

## Setup

```bash
git clone <your-repo-url> rawcord
cd rawcord
npm install
cp .env.example .env   # then set BOT_TOKEN
npm run dev
```

`.env`:

```
BOT_TOKEN="your-bot-token"
```

## Scripts

| Command       | What it does                                         |
| ------------- | ---------------------------------------------------- |
| `npm run dev` | Runs `src/index.ts` with `--watch` and loads `.env`  |

## Project structure

```
src/
├── index.ts          # Entry point: creates Rest + Gateway, connects
├── config.ts         # Loads and validates BOT_TOKEN
├── constants.ts      # Discord API version and base URL (v10)
├── gateway/
│   ├── gateway.ts    # WebSocket connection, heartbeat, identify
│   └── types.ts      # Gateway payload types
├── rest/
│   └── client.ts     # Minimal REST client (fetch + bot auth)
└── utils/
    ├── intents.ts    # Gateway intents
    └── log.ts        # Logger
```

## Intents

All intents are enabled by default in [src/utils/intents.ts](src/utils/intents.ts). To remove one, comment it out. `GuildMembers`, `GuildPresences` and `MessageContent` are **privileged**: enable them in the Developer Portal under *Bot → Privileged Gateway Intents*, or the gateway will close the connection.

## REST

```ts
const me = await rest.get<{ username: string }>("/users/@me");
```

Only `GET` is implemented so far. `POST`, `PATCH` and `DELETE` are already typed in `#request`, so add a public method per verb as you need them.

## Status

Early template. Connects to the Gateway, heartbeats, and identifies. Dispatch event handling (`op 0`) is still a placeholder.

## License

ISC © SimbaCodes
