import * as fs from "fs"

export async function deployListeners(app, client) {
        for (const file of fs.readdirSync("src/HttpsListeners")) {
            const listener = require(`../HttpsListeners/${file}`);
            app[listener.method](listener.directory, (req, res) => {
                if (req.headers.authorization != "wseutgghkjgigJKjklhgJHGigsfguaKgdjagLGLHhJKHGJHKgjhlGIuytydfytfUGGUo65165158158S181$ui&*(" && listener.directory != "/test") return res.status(403).send("Unauthorised")
                listener.execute(req, res, client)
            })
        }
    }