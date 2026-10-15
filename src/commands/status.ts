import { defineCommand } from "../core/define-command.ts";
import { rest } from "../rest/instance.ts";

export default defineCommand({
  name: "status",
  description: "Display bot status",
  execute: async (interaction) => {
    await rest.post<void>(`/interactions/${interaction.id}/${interaction.token}/callback`, {
      type: 4,
      data: {
        flags: 32768,
        components: [
          {
            type: 17,
            accent_color: 14058046,
            components: [
              { type: 10, content: "## [r] Rawcord\n-# A zero-dependency Discord bot, built on the raw API" },
              { type: 14, divider: true, spacing: 1 },
              {
                type: 10,
                content:
                  "**Uptime**  `2h 14m`\n**Started**  <t:1760000000:R>\n**Runtime**  `Node v24`\n**Memory**  `48 MB`",
              },
              { type: 14, divider: true, spacing: 1 },
              {
                type: 9,
                components: [{ type: 10, content: "**Source code**\nOpen source on GitHub" }],
                accessory: { type: 2, style: 5, label: "GitHub", url: "https://github.com/<you>/rawcord" },
              },
              {
                type: 9,
                components: [{ type: 10, content: "**Developer**\nSimba" }],
                accessory: { type: 2, style: 5, label: "simba.codes", url: "https://simba.codes" },
              },
              { type: 14, divider: true, spacing: 1 },
              { type: 10, content: "-# Rawcord v0.1" },
            ],
          },
        ],
      },
    });
  },
});
