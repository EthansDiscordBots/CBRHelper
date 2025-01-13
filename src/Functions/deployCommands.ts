import * as fs from "fs"
import { REST, Routes } from "discord.js";
export async function deployCommands(client) {
    const commands = new Set()


    for (var folder of fs.readdirSync("src/Commands")) {
        const commandFiles = fs.readdirSync(`src/Commands/${folder}`).filter(file => file.endsWith('.ts'));
        for (var file of commandFiles) {
            const command = require(`../Commands/${folder}/${file}`);
            commands.add(command.data.toJSON())
        }
    }

    const rest = new REST({ version: "9" }).setToken(String(process.env.token));

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(String(process.env.CLIENTID)), { //global cmds = Routes.applicationCommands(clientId) and guild cmds is Routes.applicationGuildCommands(clientId, guildId)
            body: Array.from(commands)
        },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}