import { DISCORD_API_BASE } from "../constants.ts";

export class Rest {
  #token: string;

  constructor(token: string) {
    this.#token = token;
  }

  get<T>(path: string): Promise<T> {
    return this.#request<T>("GET", path);
  }

  async #request<T>(method: "GET" | "POST" | "PATCH" | "DELETE", path: string): Promise<T> {
    const res = await fetch(`${DISCORD_API_BASE}${path}`, {
      method,
      headers: { Authorization: `Bot ${this.#token}` },
    });
    if (!res.ok) throw new Error(`${method} ${path} failed: [STATUS] ${res.status} [TEXT] ${await res.text()}`);
    return (await res.json()) as T;
  }
}
