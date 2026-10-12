import type { GatewayMessageCreateDispatchData, GatewayReadyDispatchData } from "discord-api-types/v10";

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
  
}
