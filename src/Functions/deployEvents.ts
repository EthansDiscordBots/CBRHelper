import * as fs from "fs"

export async function deployEvents(client) {
        for (const file of fs.readdirSync("src/Events")) {
            const event = require(`../Events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
        for (const file of fs.readdirSync("src/HttpsListeners")) {
            const event = require(`../HttpsListeners/${file}`);
            if (!event.discordEvent) continue
            if (event.discordOnce) {
                client.once(event.discordEvent, (...args) => event.run(...args, client));
            } else {
                client.on(event.discordEvent, (...args) => event.run(...args, client));
            }
        }
        for (const file of fs.readdirSync("src/OnBoot")) {
            const event = require(`../OnBoot/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
        for (const file of fs.readdirSync("src/Modals&Buttons")) {
            const event = require(`../Modals&Buttons/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
        for (const file of fs.readdirSync("src/Logging")) {
            const event = require(`../Logging/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }