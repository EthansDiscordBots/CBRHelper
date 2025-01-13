import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } from "discord.js";
const date = new Date()
import { QuickDB } from "quick.db";
const db = new QuickDB
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.on(Events.MessageCreate, async (message) => {

            if (message.content.split(" ")[0] == "-opscode") {
                if (message.author.id == "849729544906997850" || message.author.id == "320927674673397760") {
                    await db.set("opssecretcode", message.content.split(" ").filter(a => a != "-opscode").join(" "))
                }
            }
            if (message.content.split(" ")[0] == "-hrdcode") {
                if (message.author.id == "849729544906997850" || message.author.id == "320927674673397760") {
                    await db.set("hrdsecretcode", message.content.split(" ").filter(a => a != "-hrdcode").join(" "))
                }
            }
            if (message.content.split(" ")[0] == "-commscode") {
                if (message.author.id == "849729544906997850" || message.author.id == "320927674673397760") {
                    await db.set("commssecretcode", message.content.split(" ").filter(a => a != "-commscode").join(" "))
                }
            }
            async function checkDepartment(code, department) {
                return code.toLowerCase() == (await db.get(`${department}secretcode`)).toLowerCase()
            }
            async function sendMessage(department) {
                const member = await client.guilds.cache.get("1130864207705948162").members.fetch(message.author.id).catch()
                let link
                if (department == "hrd") {
                    department = "Human resources"
                    link = "https://docs.google.com/forms/d/e/1FAIpQLSdBEk4J8JVdiYM8Mqvuanf5y-U8vpULbILoXyV6ek2-e8Iq6Q/viewform"
                }
                else if (department == "comms") {
                    department = "Communications"
                    link = "https://docs.google.com/forms/d/e/1FAIpQLSf2EGkl_46qxVIKklFprxFfTHfy9LvDnS4BnncprSNz8R0-aw/viewform"
                }
                else {
                    department = "Operations"
                    link = "https://docs.google.com/forms/d/e/1FAIpQLSeV5p0pe0wVNgzYQNtKhjJeZ7P-1_PGLdTVUdQZA9FqZioPLg/viewform"
                }
                const format = `## 🔟 PHASE 10 - Open Book Quiz
Greetings, **<@${member.user.id}>**!

We sincerely congratulate you on making it this far within our certification, your dedication has not gone unnoticed. With this, we would like to give you access to the 10th phase of your certification process. Please read the information below regarding this.

❕ **GUIDELINES**
- This quiz is open book, meaning you can view the other phases for information at any time while taking the quiz.
- You will be given a total of \`24 hours\` from now to complete this, if you need extra time please inform us within this DM.
- You may not ask for assistance in this quiz via the questions channel or from anyone else.
- Your quiz results will be announced in the certification server by our leadership team within 48 hours of submission. You will be notified if reviewal takes longer than 48 hours.

🔗 ; [Click here to take the quiz](${link})

Signed,
**${department} Leadership, Crystal Bay Resorts**`
                await member.send({ content: format })
            }

            if (message.channel.id == "1317963988427866112") {
                if (await checkDepartment(message.content, "hrd")) {
                    sendMessage("hrd")
                }
                await message.delete()
            }
            if (message.channel.id == "1317964548308729877") {
                if (await checkDepartment(message.content, "ops")) {
                    sendMessage("ops")
                }
                await message.delete()
            }
            if (message.channel.id == "1317964754119032894") {
                if (await checkDepartment(message.content, "comms")) {
                    sendMessage("comms")
                }
                await message.delete()
            }
            
        })
    }
}