import { CommandInteraction, Client } from "discord.js";
import { Collection } from "discord.js";
import * as fs from "fs";
import { deployEvents } from "../Functions/deployEvents";
import { deployCommands } from "../Functions/deployCommands";

interface Command {
  data: {
    name: string;
  };
  execute: (interaction: CommandInteraction, client: Client) => Promise<void>;
}

const commands = new Collection<keyof Command, Command>();

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client: Client) {
    if (!interaction.isCommand()) return;

    for (const folder of fs.readdirSync("src/Commands")) {
      const commandFiles = fs.readdirSync(`src/Commands/${folder}`).filter(file => file.endsWith('.ts'));
      for (const file of commandFiles) {
        const command = require(`../Commands/${folder}/${file}`);
        commands.set(command.data.name, command);
      }
    }

    const command = commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      }).catch(async err => {
        await interaction.followUp({
          content: 'There was an error while executing this command!'
        })
      });
    }
  },
};