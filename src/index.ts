const DISCORD_API_BASE = "https://discord.com/api/v10";
const token = validateToken(process.env.BOT_TOKEN);

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
