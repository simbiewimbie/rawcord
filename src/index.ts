import { Gateway } from "./gateway/gateway.ts";
import { intents } from "./utils/intents.ts";
import { BOT_TOKEN } from "./config.ts";
import { Rest } from "./rest/client.ts";
import { TypedEmitter } from "./core/typed-emitter.ts";
import log from "./utils/log.ts";

const rest = new Rest(BOT_TOKEN);
const emitter = new TypedEmitter();
const gateway = new Gateway(BOT_TOKEN, intents, rest, emitter);
emitter.once("READY", (data) => {
  log("ready", `[Client] Ready!`);
});

emitter.on("MESSAGE_CREATE", (data) => {
  console.log((data as { content: string }).content);
});
await gateway.connect();
