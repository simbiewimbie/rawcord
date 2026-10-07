// Gateway Types

export interface GatewayResponse {
  url: string;
}

export interface GatewayMessage {
  op: number; // operation code
  s: number | null; // sequence number
  d: unknown; // data
  t: string | null; // event type
}
