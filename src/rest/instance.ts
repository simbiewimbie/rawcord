import { BOT_TOKEN } from "../config.ts";
import { Rest } from "./client.ts";

export const rest = new Rest(BOT_TOKEN);
