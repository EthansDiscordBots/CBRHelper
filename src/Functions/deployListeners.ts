import * as fs from "fs"

export async function deployListeners(app) {
        for (const file of fs.readdirSync("src/HttpsListeners")) {
            const listener = require(`../HttpsListeners/${file}`);
            app[listener.method](listener.directory, (req, res) => {
                console.log(req.headers)
                if (req.headers.authorization != "wseutgghkjgigJKjklhgJHGigsfguaKgdjagLGLHhJKHGJHKgjhlGIuytydfytfUGGUo65165158158S181$ui&*(" && listener.authNeeded) return res.status(403).send("Unauthorised")
                listener.execute(req, res)
            })
        }
    }