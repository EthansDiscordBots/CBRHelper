const { Client, GatewayIntentBits, Partials} = require(`discord.js`);
const client = new Client({ intents: [GatewayIntentBits.GuildVoiceStates ,GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages], partials: [Partials.Message, Partials.Channel, Partials.Reaction] }); 
import { deployEvents } from "./src/Functions/deployEvents";
import { deployCommands } from "./src/Functions/deployCommands";
import { CommandLogs } from "./src/Functions/CommandLoggingFunction";
import { deployListeners } from "./src/Functions/deployListeners";
const express = require("express");
const bodyParser = require("body-parser");
client.setMaxListeners(100);
require('dotenv').config();
deployCommands(client)
deployEvents(client)

client.login(String(process.env.token))

const app = express();
const PORT = 5000; // Use any available port

app.use(bodyParser.json());

app.post("/command-logging", async (req, res) => {
     if (req.headers.authorization != "wseutgghkjgigJKjklhgJHGigsfguaKgdjagLGLHhJKHGJHKgjhlGIuytydfytfUGGUo65165158158S181$ui&*(") {
         res.status(403).send("Unauthorized.")
         return
     }
     console.log("recieved")
     console.log(req.body)
    await CommandLogs(req.body)
    res.status(200).send("Logged")
});

deployListeners(app, client)

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Webhook listener running on port ${PORT}`);
});