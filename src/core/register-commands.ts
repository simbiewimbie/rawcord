import type { APIApplicationCommand, RESTPutAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { APPLICATION_ID, GUILD_ID } from "../config.ts";
import type { Rest } from "../rest/client.ts";

export async function registerCommands(rest: Rest): Promise<void> {
  const commands: RESTPutAPIApplicationCommandsJSONBody = [{ name: "ping", description: "replies with pong", type: 1 }];
  const path = GUILD_ID
    ? `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`
    : `/applications/${APPLICATION_ID}/commands`;

  const res = await rest.put<APIApplicationCommand[]>(path, commands);
  console.log(`Registered ${res.length} commands!`);
}
