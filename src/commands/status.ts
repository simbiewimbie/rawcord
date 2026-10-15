import { defineCommand } from "../core/define-command.ts";
import { DEVELOPER, REPO_URL, VERSION, WEBSITE_URL } from "../constants.ts";
import { rest } from "../rest/instance.ts";
import { formatUptime } from "../utils/format.ts";

const WIDTH_PAD = "\u2800".repeat(25);

export default defineCommand({
  name: "status",
  description: "Display bot status",
  execute: async (interaction) => {
    const uptime = process.uptime();
    const startedAt = Math.floor(Date.now() / 1000 - uptime);
    const memoryMb = Math.round(process.memoryUsage.rss() / 1024 / 1024);

    const stats = [
      `**Uptime**  \`${formatUptime(uptime)}\``,
      `**Started**  <t:${startedAt}:R>`,
      `**Runtime**  \`Node ${process.version}\``,
      `**Memory**  \`${memoryMb} MB\``,
    ].join("\n");

    await rest.post<void>(`/interactions/${interaction.id}/${interaction.token}/callback`, {
      type: 4,
      data: {
        flags: 32768,
        components: [
          {
            type: 17,
            accent_color: 14058046,
            components: [
              {
                type: 10,
                content: `## [r] Rawcord\n-# A zero-dependency Discord bot, built on the raw API${WIDTH_PAD}`,
              },
              { type: 14, divider: true, spacing: 1 },
              { type: 10, content: stats },
              { type: 14, divider: true, spacing: 1 },
              {
                type: 9,
                components: [{ type: 10, content: "**Source code**\nOpen source on GitHub" }],
                accessory: { type: 2, style: 5, label: "GitHub", url: REPO_URL },
              },
              {
                type: 9,
                components: [{ type: 10, content: `**Developer**\n${DEVELOPER}` }],
                accessory: { type: 2, style: 5, label: WEBSITE_URL.replace("https://", ""), url: WEBSITE_URL },
              },
              { type: 14, divider: true, spacing: 1 },
              { type: 10, content: `-# Rawcord v${VERSION}` },
            ],
          },
        ],
      },
    });
  },
});
