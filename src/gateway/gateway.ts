import type { GatewayMessage, GatewayResponse } from "../types/types.ts";
import type { Rest } from "../rest/client.ts";
import { API_VERSION } from "../constants.ts";
import log from "../utils/log.ts";
import type { TypedEmitter } from "../core/typed-emitter.ts";
import { skip } from "node:test";

export class Gateway {
  #token: string;
  #intents: number;
  #rest: Rest;
  #emitter: TypedEmitter;
  #ws: WebSocket | undefined;
  #lastSequence: number | null = null;
  #heartbeatTimer: ReturnType<typeof setInterval> | undefined;

  constructor(token: string, intents: number, rest: Rest, emitter: TypedEmitter) {
    this.#token = token;
    this.#intents = intents;
    this.#rest = rest;
    this.#emitter = emitter;
  }

  async connect() {
    // Gateway URL
    const url = (await this.#rest.get<GatewayResponse>("/gateway")).url;

    // Websocket
    this.#ws = new WebSocket(`${url}?v=${API_VERSION}&encoding=json`);

    // Listeners
    this.#ws.addEventListener("open", (event) => {
      log("ready", "[WebSocket] Gateway Connection Open.");
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
      // log("info", `[WebSocket] Received Message: Opcode: ${data.op}.`);

      if (data.s !== null) this.#lastSequence = data.s;

      switch (data.op) {
        case 0: {
          if (!data.t) return;
          this.#emitter.emit(data.t, data.d);
          break;
        }

        case 10: {
          this.#identify();
          const interval = (data.d as { heartbeat_interval: number }).heartbeat_interval;
          this.#heartbeatTimer = setTimeout(() => {
            this.#heartbeat();
            this.#heartbeatTimer = setInterval(() => {
              this.#heartbeat();
            }, interval);
          }, interval * Math.random());
          break;
        }
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
