import * as fs from "fs"

export async function deployListeners(app) {
        for (const file of fs.readdirSync("src/HttpsListeners")) {
            if (file.endsWith(".ts")) {
                const listener = require(`../HttpsListeners/${file}`);
                app[listener.method](listener.directory, (req, res) => {
                    if (req.headers.authorization != "wseutgghkjgigJKjklhgJHGigsfguaKgdjagLGLHhJKHGJHKgjhlGIuytydfytfUGGUo65165158158S181$ui&*(" && listener.authNeeded) return res.status(403).send("Unauthorised")
                    listener.execute(req, res)
                })
            }
            else {
                for (const newfile of fs.readdirSync(`src/HttpsListeners/${file}`)) {
                    const newlistener = require(`../HttpsListeners/${file}/${newfile}`)
                    console.log("found listener")
                    console.log(newlistener)
                    app[newlistener.method](newlistener.directory, (req, res) => {
                        if (req.headers.authorization != "wseutgghkjgigJKjklhgJHGigsfguaKgdjagLGLHhJKHGJHKgjhlGIuytydfytfUGGUo65165158158S181$ui&*(" && newlistener.authNeeded) return res.status(403).send("Unauthorised")
                            newlistener.execute(req, res)
                    })
                }
            }
        }
    }