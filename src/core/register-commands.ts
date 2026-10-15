import type { APIApplicationCommand, RESTPutAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { APPLICATION_ID, GUILD_ID } from "../config.ts";
import type { Rest } from "../rest/client.ts";
import { commands } from "./load-command.ts"; // the map of commands
import log from "../utils/log.ts";

export async function registerCommands(rest: Rest): Promise<void> {
  const commandList: RESTPutAPIApplicationCommandsJSONBody = Array.from(commands.values()).map((c) => ({
    name: c.name,
    description: c.description,
    type: 1,
  }));

  const path = GUILD_ID
    ? `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`
    : `/applications/${APPLICATION_ID}/commands`;

  const registeredCommands: APIApplicationCommand[] = await rest.get<APIApplicationCommand[]>(path);

  const changed = commandsChanged(
    Array.from(commands.values().map((c) => ({ name: c.name, description: c.description }))),
    registeredCommands.map((c) => ({ name: c.name, description: c.description })),
  );

  if (changed) {
    await rest.put(path, commandList);
    log("info", `[REGISTRAR] ${commandList.length} command${commandList.length > 1 ? "s" : ""} registered!`);
  } else {
    log("info", `[REGISTRAR] No new commands were registered.`);
  }
}

function commandsChanged(
  toRegister: { name: string; description: string }[],
  registered: { name: string; description: string }[],
): boolean {
  const toRegisterString = JSON.stringify(toRegister.sort((a, b) => a.name.localeCompare(b.name)));
  const registeredString = JSON.stringify(registered.sort((a, b) => a.name.localeCompare(b.name)));
  return toRegisterString !== registeredString;
}
