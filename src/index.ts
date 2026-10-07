import { Gateway } from "./gateway/gateway.ts";
import { intents } from "./utils/intents.ts";
import { BOT_TOKEN } from "./config.ts";
import { Rest } from "./rest/client.ts";

let rest = new Rest(BOT_TOKEN);
const gateway = new Gateway(BOT_TOKEN, intents, rest);
await gateway.connect();

// let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
// let lastSequence: number | null = null;

// interface GatewayResponse {
//   url: string;
// }

// interface GatewayMessage {
//   op: number; // operation code
//   s: number | null; // sequence number
//   d: unknown; // data
//   t: string | null; // event type
// }

// export const Intents = {
//   Guilds: 1 << 0,
//   GuildMembers: 1 << 1, // privileged
//   GuildModeration: 1 << 2,
//   GuildExpressions: 1 << 3,
//   GuildIntegrations: 1 << 4,
//   GuildWebhooks: 1 << 5,
//   GuildInvites: 1 << 6,
//   GuildVoiceStates: 1 << 7,
//   GuildPresences: 1 << 8, // privileged
//   GuildMessages: 1 << 9,
//   GuildMessageReactions: 1 << 10,
//   GuildMessageTyping: 1 << 11,
//   DirectMessages: 1 << 12,
//   DirectMessageReactions: 1 << 13,
//   DirectMessageTyping: 1 << 14,
//   MessageContent: 1 << 15, // privileged
//   GuildScheduledEvents: 1 << 16,
//   AutoModerationConfiguration: 1 << 20,
//   AutoModerationExecution: 1 << 21,
//   GuildMessagePolls: 1 << 24,
//   DirectMessagePolls: 1 << 25,
// } as const;

// // Fetch Gateway URL
// const res = await fetch(`${DISCORD_API_BASE}/gateway`, { method: "GET" });
// if (!res.ok) {
//   console.error(`Discord API error: ${res.status} ${await res.text()}`);
//   process.exit(1);
// }
// const { url: gatewayURL } = (await res.json()) as GatewayResponse;

// // Open WS Connection
// const ws = new WebSocket(`${gatewayURL}?v=10&encoding=json`);

// ws.addEventListener("open", (event) => {
//   console.log("[WebSocket] Opened: ", event.timeStamp);
// });

// ws.addEventListener("close", (event) => {
//   console.log("[WebSocket] Closed: ", event.code, event.reason);
//   clearInterval(heartbeatTimer);
// });

// ws.addEventListener("error", (event) => {
//   console.error("[WebSocket] Error: ", event.error);
// });

// ws.addEventListener("message", (event) => {
//   const data = JSON.parse(event.data) as GatewayMessage;
//   console.log("[WebSocket] Message: ", data);

//   if (data.s) lastSequence = data.s;

//   if (data.op === 0) {
//     console.log("received event : " + data.t);
//   }
//   if (data.op === 10) {
//     setActivityStatus(ws, (1 << 0) | (1 << 9), { os: `${process.platform}`, browser: "rawcord", device: "rawcord" });

//     const d = data.d as { heartbeat_interval: number };
//     heartbeatTimer = setTimeout(() => {
//       sendHeartbeat(ws);
//       heartbeatTimer = setInterval(() => {
//         sendHeartbeat(ws);
//       }, d.heartbeat_interval);
//     }, d.heartbeat_interval * Math.random());
//   } else if (data.op === 11) {
//     console.log("[WebSocket Message] Heartbeat ACK");
//   }
// });

// // Helper Functions
// function sendHeartbeat(ws: WebSocket) {
//   ws.send(JSON.stringify({ op: 1, d: lastSequence }));
// }

// function setActivityStatus(
//   ws: WebSocket,
//   intents: number,
//   properties: { os: string; browser: string; device: string },
// ) {
//   ws.send(JSON.stringify({ op: 2, d: { token, intents, properties } }));
// }
