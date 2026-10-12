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
├── index.ts              # Entry point: creates Rest, TypedEmitter and Gateway, loads events, connects
├── config.ts             # Loads and validates BOT_TOKEN
├── constants.ts          # Discord API version and base URL (v10)
├── core/
│   ├── typed-emitter.ts  # Typed on / once / off / emit for gateway events
│   ├── define-event.ts   # defineEvent() helper for event files
│   └── load-events.ts    # Imports every file in src/events/ and registers it
├── events/
│   ├── ready.ts          # READY handler (empty stub)
│   └── messageCreate.ts  # MESSAGE_CREATE handler (empty stub)
├── gateway/
│   ├── gateway.ts        # WebSocket connection, heartbeat, identify, dispatch (op 0)
│   └── events.ts         # EVENT_NAMES: every valid gateway event name
├── rest/
│   └── client.ts         # Minimal REST client (fetch + bot auth)
├── types/
│   └── types.ts          # Gateway payload types and the GatewayEvents map
└── utils/
    ├── intents.ts        # Gateway intents
    └── log.ts            # Logger
```

## Intents

All intents are enabled by default in [src/utils/intents.ts](src/utils/intents.ts). To remove one, comment it out. `GuildMembers`, `GuildPresences` and `MessageContent` are **privileged**: enable them in the Developer Portal under *Bot → Privileged Gateway Intents*, or the gateway will close the connection.

## REST

```ts
const me = await rest.get<{ username: string }>("/users/@me");
```

Only `GET` is implemented so far. `POST`, `PATCH` and `DELETE` are already typed in `#request`, so add a public method per verb as you need them.

## Events

Each file in `src/events/` handles one Gateway event. Files in subfolders are picked up too. The event name comes from `defineEvent()`, so the file name doesn't matter. A file whose default export is a plain function uses its file name instead: `messageCreate.ts` (or `message-create.ts`) handles `MESSAGE_CREATE`. The name must be in `EVENT_NAMES` ([src/gateway/events.ts](src/gateway/events.ts)), or the loader logs an error and skips the file.

```ts
// src/events/messageCreate.ts
import { defineEvent } from "../core/define-event.ts";

export default defineEvent("MESSAGE_CREATE", (message) => {
  console.log(message.content);
});
```

The handler's `data` is typed from the `GatewayEvents` map in [src/types/types.ts](src/types/types.ts). To type a new event, add it to that map.

## Status

Early template. Connects to the Gateway, heartbeats, identifies, and dispatches events (`op 0`) to the handlers in `src/events/`. `READY` logs that the client is ready, and `MESSAGE_CREATE` is an empty stub. SQLite is not wired up yet.

## License

ISC © SimbaCodes
