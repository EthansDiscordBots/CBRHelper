import { ChannelType, EmbedBuilder, Events, Message } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB();
import { getNextQuestion, checkQuestionAnswer } from "../Functions/getNextCertifyQuestion";
import { Client as MarcSyncClient } from "marcsync";
const ms = new MarcSyncClient(String(process.env.mskey))
const certicoll = ms.getCollection("certified")
import { retryOperation } from "../Functions/retry";
import { getCachedRobloxFromDiscord } from "../Functions/getCachedRobloxFromDiscord";

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.on(Events.MessageCreate, async message => {
            let msg: Message = message
            if (msg.channel.type == ChannelType.DM) {
                let override = false
                if (await db.get(`${msg.author.id}.currentQuestion`) == undefined) return
                if (await db.get(`${msg.author.id}.currentQuestion`) == 0 && msg.content.toLowerCase() == "continue") {
                    await db.set(`${msg.author.id}.currentQuestion`, 1);
                    override = true
                }
                if (await db.get(`${msg.author.id}.currentQuestion`) == 0 && msg.content.toLowerCase() != "continue") return
                const question = await getNextQuestion(await db.get(`${msg.author.id}.currentQuestion`))
                if (question == null) {
                    const correct = await db.get(`${msg.author.id}.certificationQuestionsCorrect`) 
                    const embed = new EmbedBuilder()
                    if (correct >= 12) {
                        embed.setColor("Green")
                        embed.setDescription(`Congratulations. You have passed the Management Certification Quiz with ${correct}/16 correct answers.
You should have been roled in the main discord server, if you have not, please contact scr1ptxdethxn immediately with this message as proof.`)
                        retryOperation(async function() {
                            return await certicoll.createEntry({robloxId: await getCachedRobloxFromDiscord(msg.author.id), discordId: msg.author.id})
                        })
                        await (await client.guilds.cache.get(process.env.MainServerId).members.fetch(msg.author.id)).roles.add("1324386691829600286")
                    }
                    else {
                        embed.setColor("Red")
                        embed.setDescription(`Unfortunately, you have failed the Management Certification Quiz with ${correct}/16 correct.
You can use the /certify command in <#987090275224649798> to try again.`)
                    }
                    await msg.author.send({embeds: [embed]})
                    return
                }
                const answers = ["a","b","c","d"]
                if (answers.indexOf(msg.content.toLowerCase()) == -1 && !override) return
                const Embed = new EmbedBuilder()
                .setTitle(question.question)
                .setDescription(question.options.map((option, index) => `${String.fromCharCode(65 + index)} - ${option}`).join("\n"))
               
                await msg.author.send({embeds: [Embed]})
                const curent = await db.add(`${msg.author.id}.currentQuestion`, 1)
                if (override) return
                
                
                if (await checkQuestionAnswer(curent-2, message.content)) {
                    await db.add(`${msg.author.id}.certificationQuestionsCorrect`, 1)
                }
               

            }
        }) 
    }
}