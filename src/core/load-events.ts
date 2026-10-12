import type { TypedEmitter } from "./typed-emitter.ts";
import type { GatewayEvents } from "../types/types.ts";
import { EVENT_NAMES } from "../gateway/events.ts";
import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { pathToFileURL } from "node:url";
import log from "../utils/log.ts";

export async function loadEvents(emitter: TypedEmitter, dir: string): Promise<void> {
  const eventFiles = (await readdir(dir, { recursive: true })).filter((d) => d.endsWith(".ts"));

  for (const file of eventFiles) {
    const fullPath = join(dir, file);

    let name;
    let handler;

    const mod = await import(pathToFileURL(fullPath).href);
    if (!mod.default) {
      log("error", `[Loader] Default export missing: "${fullPath}"`);
      continue;
    }

    if (typeof mod.default === "function") {
      name = toEventName(file);
      handler = mod.default;
    } else {
      name = mod.default.name;
      handler = mod.default.handler;
    }

    if (!EVENT_NAMES.includes(name)) {
      log("error", `[Loader] Event name "${name}" is not a valid event name.`);
      continue;
    }

    emitter.on(name as keyof GatewayEvents, handler);
  }
}

function toEventName(file: string): string {
  return basename(file, ".ts")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replaceAll("-", "_")
    .toUpperCase();
}
