import * as fs from "fs"

export async function deployListeners(app) {
        for (const file of fs.readdirSync("src/HttpsListeners")) {
            if (file.endsWith(".ts")) {
                const listener = require(`../HttpsListeners/${file}`);
                app[listener.method](listener.directory, (req, res) => {
                    if (req.headers.authorization != String(process.env.WebsiteAuth) && listener.authNeeded) return res.status(403).json({message: "Unauthorised"})
                    listener.execute(req, res)
                })
            }
            else {
                for (const newfile of fs.readdirSync(`src/HttpsListeners/${file}`)) {
                    const newlistener = require(`../HttpsListeners/${file}/${newfile}`)
                    app[newlistener.method](newlistener.directory, (req, res) => {
                        if (req.headers.authorization != String(process.env.WebsiteAuth) && newlistener.authNeeded) return res.status(403).json({message: "Unauthorised"})
                            newlistener.execute(req, res)
                    })
                }
            }
        }
    }