import { defineEvent } from "../core/define-event.ts";
import log from "../utils/log.ts";

export default defineEvent("READY", (data) => {
  log("ready", `[EVENT] Client "${data.user.username}" is ready.`);
});
