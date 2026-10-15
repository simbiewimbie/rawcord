import { defineCommand } from "../core/define-command.ts";
import { rest } from "../rest/instance.ts";

export default defineCommand({
  name: "ping",
  description: "Replies to pong",
  execute: async (interaction) => {
    await rest.post<void>(`/interactions/${interaction.id}/${interaction.token}/callback`, {
      type: 4,
      data: { content: "pong!" },
    });
  },
});
