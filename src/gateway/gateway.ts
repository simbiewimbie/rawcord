import type { GatewayMessage, GatewayResponse } from "./types.ts";
import type { Rest } from "../rest/client.ts";
import { API_VERSION } from "../constants.ts";
import log from "../utils/log.ts";

export class Gateway {
  #token: string;
  #intents: number;
  #heartbeatTimer: ReturnType<typeof setInterval> | undefined;
  #lastSequence: number | null = null;
  #rest: Rest;
  #ws: WebSocket | undefined;

  constructor(token: string, intents: number, rest: Rest) {
    this.#token = token;
    this.#intents = intents;
    this.#rest = rest;
  }

  async connect() {
    // Gateway URL
    const url = (await this.#rest.get<GatewayResponse>("/gateway")).url;

    // Websocket
    this.#ws = new WebSocket(`${url}?v=${API_VERSION}&encoding=json`);

    // Listeners
    this.#ws.addEventListener("open", (event) => {
      log("info", "[WebSocket] Connection Open.");
    });

    this.#ws.addEventListener("error", (event) => {
      log("error", `[WebSocket] Error: ${event.error?.name} - ${event.error?.message}`);
    });

    this.#ws.addEventListener("close", (event) => {
      clearInterval(this.#heartbeatTimer);
      log("info", `[WebSocket] Connection Closed. Code: ${event.code}. Reason: ${event.reason}`);
    });

    this.#ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data) as GatewayMessage;
      log("info", `[WebSocket] Received Message: Opcode: ${data.op}.`);

      // update last sequence
      if (data.s !== null) this.#lastSequence = data.s;

      // handle events
      if (data.op === 0) {
      }

      if (data.op === 10) {
        // identify
        this.#identify();

        // handle Hello
        const interval = (data.d as { heartbeat_interval: number }).heartbeat_interval;
        this.#heartbeatTimer = setTimeout(() => {
          this.#heartbeat();
          this.#heartbeatTimer = setInterval(() => {
            this.#heartbeat();
          }, interval);
        }, interval * Math.random());
      }
    });
  }

  #heartbeat() {
    if (!this.#ws) return;
    this.#ws.send(JSON.stringify({ op: 1, d: this.#lastSequence }));
  }

  #identify() {
    if (!this.#ws) return;
    this.#ws.send(
      JSON.stringify({
        op: 2,
        d: {
          token: this.#token,
          properties: { os: process.platform, browser: "rawcord", device: "rawcord" },
          intents: this.#intents,
        },
      }),
    );
  }
}
