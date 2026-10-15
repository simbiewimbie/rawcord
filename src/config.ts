export const BOT_TOKEN = requireEnv("BOT_TOKEN");
export const APPLICATION_ID = requireEnv("APPLICATION_ID");
export const GUILD_ID = optionalEnv("GUILD_ID");

function optionalEnv(variable: string): string | undefined {
  return process.env[variable]?.trim() || undefined;
}

function requireEnv(variable: string): string {
  let env = process.env[variable]?.trim();
  if (!env) {
    throw new Error(`${variable.toUpperCase()} is undefined. Define '${variable.toUpperCase()}' in .env`);
  } else {
    return env.trim();
  }
}
