import { TypedEmitter } from "./core/typed-emitter.ts";
import { loadEvents } from "./core/load-events.ts";
import { Gateway } from "./gateway/gateway.ts";
import { intents } from "./utils/intents.ts";
import { BOT_TOKEN } from "./config.ts";
import { Rest } from "./rest/client.ts";
import { join } from "node:path";

const rest = new Rest(BOT_TOKEN);
const emitter = new TypedEmitter();
const gateway = new Gateway(BOT_TOKEN, intents, rest, emitter);
await loadEvents(emitter, join(import.meta.dirname, "./events"));
await gateway.connect();
