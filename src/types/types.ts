import type {
  GatewayInteractionCreateDispatchData,
  GatewayMessageCreateDispatchData,
  GatewayReadyDispatchData,
} from "discord-api-types/v10";
import type { Handler } from "../core/typed-emitter.ts";

export interface GatewayResponse {
  url: string;
}

export interface GatewayMessage {
  op: number; // operation code
  s: number | null; // sequence number
  d: unknown; // data
  t: string | null; // event type
}

export interface GatewayEvents {
  READY: GatewayReadyDispatchData;
  MESSAGE_CREATE: GatewayMessageCreateDispatchData;
  INTERACTION_CREATE: GatewayInteractionCreateDispatchData;
}

export interface EventDefinition<T extends keyof GatewayEvents> {
  name: T;
  handler: Handler<T>;
}
