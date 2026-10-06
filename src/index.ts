const DISCORD_API_BASE = "https://discord.com/api/v10";
const token = validateToken(process.env.BOT_TOKEN);

let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
let lastSequence: number | null = null;

interface GatewayResponse {
  url: string;
}

interface GatewayMessage {
  op: number; // operation code
  s: number | null; // sequence number
  d: unknown; // data
  t: string | null; // event type
}

// Validate Token
function validateToken(token: string | undefined): string {
  if (token === undefined) {
    throw new Error("Token is undefined. Define `BOT_TOKEN` in .env");
  }
  if (token.trim().length === 0) {
    throw new Error("Invalid token defined. Redefine `BOT_TOKEN` in .env");
  }
  return token.trim();
}

// Fetch Gateway URL
const res = await fetch(`${DISCORD_API_BASE}/gateway`, { method: "GET" });
if (!res.ok) {
  console.error(`Discord API error: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const { url: gatewayURL } = (await res.json()) as GatewayResponse;

// Open WS Connection
const ws = new WebSocket(`${gatewayURL}?v=10&encoding=json`);

ws.addEventListener("open", (event) => {
  console.log("[WebSocket] Opened: ", event.timeStamp);
});

ws.addEventListener("close", (event) => {
  console.log("[WebSocket] Closed: ", event.code, event.reason);
  clearInterval(heartbeatTimer);
});

ws.addEventListener("error", (event) => {
  console.error("[WebSocket] Error: ", event.error);
});

ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data) as GatewayMessage;
  console.log("[WebSocket] Message: ", data);

  if (data.s) lastSequence = data.s;

  if (data.op === 10) {
    setActivityStatus(ws, 1, { os: `${process.platform}`, browser: "rawcord", device: "rawcord" });

    const d = data.d as { heartbeat_interval: number };
    heartbeatTimer = setTimeout(() => {
      sendHeartbeat(ws);
      heartbeatTimer = setInterval(() => {
        sendHeartbeat(ws);
      }, d.heartbeat_interval);
    }, d.heartbeat_interval * Math.random());
  } else if (data.op === 11) {
    console.log("[WebSocket Message] Heartbeat ACK");
  }
});

// Helper Functions
function sendHeartbeat(ws: WebSocket) {
  ws.send(JSON.stringify({ op: 1, d: lastSequence }));
}

function setActivityStatus(
  ws: WebSocket,
  intents: number,
  properties: { os: string; browser: string; device: string },
) {
  ws.send(JSON.stringify({ op: 2, d: { token, intents, properties } }));
}
