import type { Command } from "../types/types.ts";
import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import log from "../utils/log.ts";
import { join } from "node:path";

export const commands = new Map<string, Command>();

export async function loadCommands(dir: string): Promise<void> {
  const commandFiles = (await readdir(dir, { recursive: true })).filter((d) => d.endsWith(".ts"));

  for (const file of commandFiles) {
    const fullPath = join(dir, file);

    const mod = await import(pathToFileURL(fullPath).href);
    if (!mod.default) {
      log("error", `[LOADER] [CMD] Default export missing: "${fullPath}"`);
      continue;
    }

    const command = mod.default;
    if (commands.get(command.name)) {
      log("error", `[LOADER] Found duplicate command: "${command.name}". Path: "${fullPath}" `);
    }
    commands.set(command.name, command);

    log("debug", `[LOADER] Loaded command: "${command.name}"`);
  }
}
