import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";
import * as crypto from "crypto"
module.exports = {
    method: 'post',
    directory: "/storage/:location",
    authNeeded: true,
    async execute(req, res) {
        const { location } = req.params
        const { data } = req.body

        if (!location) return res.status(400).json("No location found")

        const collection = await db.get(`serverStorage.${location}`)
        let status = 200
        if (!collection) {
            await db.set(`serverStorage.${location}`, [])
            status = 201
        }
        async function generateUniqueId() {
            let attempts = 0;
            let byteSize = 32;
            while (true) {
                const id = crypto.randomBytes(byteSize).toString("hex");
                const exists = (await db.get(`serverStorage.${location}`)).filter(item => {
                    return Object.entries({ "_id": id }).every(([key, value]) => {
                        return item[key] === value;
                    });
                })
                if (exists.length == 0) return id;
                attempts++;
                if (attempts % 10 === 0) {
                    byteSize *= 2;
                }
            }
        }
        await db.push(`serverStorage.${location}`, { ...data, "_id": generateUniqueId() })
        return res.status(200).json({success: true, status: 200})
    },
}

