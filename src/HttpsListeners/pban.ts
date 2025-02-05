import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";
import { getUsernameFromId } from "../Functions/getIdFromUsername"

module.exports = {
    method: 'post',
    directory: "/pban",
    authNeeded: true,
    async execute(req, res) {
        let entries = req.body
        if (Array.isArray(entries)) {
            for (let i = 0; i < entries.length; i++) {
                await db.push("PbanPending", entries[i])
            }
        }
        else {
            await db.push("PbanPending", entries)
        }
        return await res.status(200).json({ message: "Pban logged" })
    },
    discordEvent: "ready",
    discordOnce: true,
    async run(client) {
        setInterval(async () => {
            let PbansPending = await db.get("PbanPending")
            const PbanEmbeds: Array<EmbedBuilder> = []

            await new Promise(r => setTimeout(r, 3000))

            if (PbansPending?.length > 0) {
                const data = PbansPending[0]
                const emmm = new EmbedBuilder()
                console.log(data)
                emmm.addFields(
                    { name: "User banned:", value: (await getUsernameFromId(data.UserId)).name + " // " + String(data.UserId), inline: true },
                    { name: "Reason:", value: data.Reason, inline: true },
                    { name: "Issued by:", value: (data.IssuerUserId == 1 ? "Automated Ban" : (await getUsernameFromId(data.IssuerUserId)).name) + " // " + String(data.IssuerUserId), inline: true }
                )

                emmm.setColor(0x00ffe5)
                PbanEmbeds.push(emmm)
                await fetch("https://cbr.ethansrandomthings.uk/storage/permbans", {
                    method: "POST",
                    headers: {
                        Authorization: process.env.WebsiteAuth as string
                    },
                    body: JSON.stringify({
                        filters: {
                            UserId: data.UserId,
                            Reason: data.Reason,
                            IssuerUserId: data.IssuerUserId
                        }
                    })
                })

                let arr = PbansPending.filter(item => item != data.UserId)
                await db.set("PbanPending", arr)
                client.channels.cache.get(process.env.PermBans).send({ embeds: PbanEmbeds }).then(msg => msg.startThread({ name: "Proof" }))
            }
        }, 10000);
    }
}

