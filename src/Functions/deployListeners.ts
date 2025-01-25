import * as fs from "fs"

export async function deployListeners(app) {
    for (const filefolder of fs.readdirSync("src/HttpsListeners")) {
        if (filefolder.endsWith(".ts")) {
            const listener = require(`../HttpsListeners/${filefolder}`);
            app[listener.method](listener.directory, (req, res) => {
                if (req.headers.authorization != "wseutgghkjgigJKjklhgJHGigsfguaKgdjagLGLHhJKHGJHKgjhlGIuytydfytfUGGUo65165158158S181$ui&*(" && listener.authNeeded) return res.status(403).send("Unauthorised")
                listener.execute(req, res)
            })
        }
        else {
            const listenerFiles = fs.readdirSync(`src/HttpsListeners/${filefolder}`);
            for (const file of listenerFiles) {
                const listener = require(`../HttpsListeners/${filefolder}/${file}`);
                app[listener.method](listener.directory, (req, res) => {
                    if (req.headers.authorization != "wseutgghkjgigJKjklhgJHGigsfguaKgdjagLGLHhJKHGJHKgjhlGIuytydfytfUGGUo65165158158S181$ui&*(" && listener.authNeeded) return res.status(403).send("Unauthorised")
                    listener.execute(req, res)
                })
            }
        }
        
    }
}