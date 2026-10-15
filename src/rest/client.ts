import { DISCORD_API_BASE } from "../constants.ts";

export class Rest {
  #token: string;

  constructor(token: string) {
    this.#token = token;
  }

  get<T>(path: string): Promise<T> {
    return this.#request<T>("GET", path);
  }

  async #request<T>(method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${DISCORD_API_BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bot ${this.#token}`,
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) throw new Error(`${method} ${path} failed: [STATUS] ${res.status} [TEXT] ${await res.text()}`);
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }
}
