import { Gateway } from "./gateway/gateway.ts";
import { intents } from "./utils/intents.ts";
import { BOT_TOKEN } from "./config.ts";
import { Rest } from "./rest/client.ts";

let rest = new Rest(BOT_TOKEN);
const gateway = new Gateway(BOT_TOKEN, intents, rest);
await gateway.connect();
