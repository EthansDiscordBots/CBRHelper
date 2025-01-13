import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Events } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB()
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.channels.cache.get("1219441779074535524").messages.fetch({after: String(await db.get(`480452557949370380.countinglastmessage`))}).then(async m => {        
            let messages = m.map(m => m)
            messages = messages.reverse()
            var mostrecentcorrect = await db.get("480452557949370380.count")
            for (const e of messages) {
                var number
                try { number = await eval(e.content) }
                catch (error) { }
                number = Math.round(number)
                if (number == mostrecentcorrect + 1) {
                    if (!await db.get(`${e.guild.id}.count_highest`)) await db.set(`${e.guild.id}.count_highest`, 0)

                    if (number > await db.get(`${e.guild.id}.count_highest`)) {
                        await e.react("☑")
                    } else {
                        await e.react("✅")
                    }
    
                    if (number % 100 == 0) e.react("💯")
                    mostrecentcorrect = mostrecentcorrect + 1
                    await db.set(`${e.guild.id}.count`, mostrecentcorrect + 1)
                }
                if (number < mostrecentcorrect) continue


            }
        })
        client.on(Events.MessageCreate, async message => {
            if (message.content.startsWith("-setnum")) {
                if (message.author.id != "849729544906997850" && message.author.id != "320927674673397760") return message.reply("This command is restricted to the bot owner only, and can not be executed by anyone else.");
                await db.set(`${message.guild.id}.count`, Number(message.content.split(" ")[1]))
                message.delete()
            }
            else if (message.channel.id == "1219441779074535524") {
                if (!await db.get(`${message.guild.id}.count`)) await db.set(`${message.guild.id}.count`, 1)
                let count = await db.get(`${message.guild.id}.count`)

                var number
                try { number = await eval(message.content) }
                catch (error) { }
                number = Math.round(number)
                if (!number) return
                if (await db.get(`${message.guild.id}.last_counter`) == message.author.id) {
                    await message.reply("**:warning:You can not be the person to count two times in a row.:warning:**")
                    return message.react("⚠")
                }
                if (number != await db.get(`${message.guild.id}.count`)) {
                    message.react("❌")
                    message.reply(`The next number was **${await db.get(`${message.guild.id}.count`)}**. The next number is now **1**`)
                    if (count > await db.get(`${message.guild.id}.count_highest`)) {
                        await db.set(`${message.guild.id}.count_highest`, count)
                    }
                    await db.set(`${message.guild.id}.countrolecurrent`, message.author.id)
                    return await db.set(`${message.guild.id}.count`, 1)
                }
                if (!await db.get(`${message.guild.id}.count_highest`)) await db.set(`${message.guild.id}.count_highest`, 0)

                if (count > await db.get(`${message.guild.id}.count_highest`)) {
                    message.react("☑")
                } else {
                    message.react("✅")
                }

                if (number % 100 == 0) message.react("💯")
                await db.set(`${message.guild.id}.count`, count + 1)
                await db.set(`${message.guild.id}.last_counter`, message.author.id)
                await db.set(`${message.guild.id}.countinglastmessage`, message.id)
            }
        })
        client.on(Events.MessageDelete, async message => {
            var number
            try { number = await eval(message.content) }
            catch (error) { }
            number = Math.round(number)
            if (message.channel.id == "1219441779074535524" && number == Number(await db.get(`${message.guild.id}.count`)) - 1) {
                message.channel.send(`Beep boop! I detected the most recent number in this channel was deleted! Just for clarication, the last number said was ${Number(await db.get(`${message.guild.id}.count`)) - 1}!`)
            }
        })
        client.on(Events.MessageUpdate, async (oldmsg, newmsg) => {
            var number
            try { number = await eval(oldmsg.content) }
            catch (error) { }
            number = Math.round(number)
            if (oldmsg.channel.id == "1219441779074535524" && number == Number(await db.get(`${oldmsg.guild.id}.count`)) - 1) {
                oldmsg.channel.send(`Beep boop! I detected the most recent number in this channel was edited! Just for clarication, the last number said was ${Number(await db.get(`${oldmsg.guild.id}.count`)) - 1}!`)
            }
        })
    }
}