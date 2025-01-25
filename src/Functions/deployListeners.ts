import * as fs from "fs"
import * as path from "path"

export async function deployListeners(app) {
    const basePath = path.join(__dirname, '../src/HttpsListeners');
    const filesAndFolders = await fs.promises.readdir(basePath);

    for (const entry of filesAndFolders) {
        const fullPath = path.join(basePath, entry);
        const stat = await fs.promises.stat(fullPath);

        if (stat.isFile() && entry.endsWith('.ts')) {
            await processListener(app, entry, basePath);
        } else if (stat.isDirectory()) {
            const subFiles = await fs.promises.readdir(fullPath);
            for (const file of subFiles) {
                if (file.endsWith('.ts')) {
                    await processListener(app, file, fullPath);
                }
            }
        }
    }
}

async function processListener(app, file, basePath) {
    try {
        const listener = require(path.join(basePath, file));

        if (listener.method && listener.directory && typeof listener.execute === "function") {
            app[listener.method](listener.directory, (req, res) => {
                if (listener.authNeeded && req.headers.authorization !== "wseutgghkjgigJKjklhgJHGigsfguaKgdjagLGLHhJKHGJHKgjhlGIuytydfytfUGGUo65165158158S181$ui&*(") {
                    return res.status(403).send("Forbidden");
                }
                listener.execute(req, res);
            });
        }
    } catch (error) {
        console.error(`Failed to load listener from ${file}:`, error);
    }
}