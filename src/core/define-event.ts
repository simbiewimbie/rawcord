import type { EventDefinition, GatewayEvents } from "../types/types.ts";
import type { Handler } from "./typed-emitter.ts";

export function defineEvent<T extends keyof GatewayEvents>(name: T, handler: Handler<T>): EventDefinition<T> {
  return { name, handler };
}
