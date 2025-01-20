import * as fs from "fs"

export async function deployListeners(app, client) {
        for (const file of fs.readdirSync("src/HttpsListeners")) {
            const listener = require(`../HttpsListeners/${file}`);
            app[listener.method](listener.directory, (req, res) => {
                listener.execute(req, res, client)
            })
        }
    }