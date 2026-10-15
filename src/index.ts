import { registerCommands } from "./core/register-commands.ts";
import { TypedEmitter } from "./core/typed-emitter.ts";
import { loadEvents } from "./core/load-events.ts";
import { Gateway } from "./gateway/gateway.ts";
import { intents } from "./utils/intents.ts";
import { rest } from "./rest/instance.ts";
import { BOT_TOKEN } from "./config.ts";
import { join } from "node:path";
import { loadCommands } from "./core/load-command.ts";

const emitter = new TypedEmitter();
const gateway = new Gateway(BOT_TOKEN, intents, rest, emitter);
await loadEvents(emitter, join(import.meta.dirname, "events"));
await loadCommands(join(import.meta.dirname, "commands"));
// await registerCommands(rest);
await gateway.connect();
