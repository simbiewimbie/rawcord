import { defineEvent } from "../core/define-event.ts";
import { commands } from "../core/load-command.ts";
import { rest } from "../rest/instance.ts";

export default defineEvent("INTERACTION_CREATE", async (interaction) => {
  // Slash Commands
  if (interaction.type === 2) {
    const command = commands.get(interaction.data.name);
    if (command) await command.execute(interaction);
  }

  return;
});
