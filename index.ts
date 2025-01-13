const { Client, GatewayIntentBits, Partials} = require(`discord.js`);
const client = new Client({ intents: [GatewayIntentBits.GuildVoiceStates ,GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages], partials: [Partials.Message, Partials.Channel, Partials.Reaction] }); 
import { deployEvents } from "./src/Functions/deployEvents";
import { deployCommands } from "./src/Functions/deployCommands";
import { getPlayerThumbnail } from "noblox.js";
client.setMaxListeners(100);
require('dotenv').config();
deployCommands(client)
deployEvents(client)
client.login(String(process.env.token))
console.log("hey5")

