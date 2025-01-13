import { SlashCommandBuilder, EmbedBuilder, Options, Interaction, CommandInteraction } from "discord.js"
import { Client } from "marcsync"
const ms = new Client(String(process.env.mskey))
import { retryOperation } from "../../Functions/retry"
import { getIdFromUsername } from "../../Functions/getIdFromUsername"
import { getUsernameFromId } from "noblox.js"
module.exports = {
    data: new SlashCommandBuilder()
        .setName("otw-set")
        .setDescription("Change the members who are staff of the week")
        .addStringOption(option => option.setName("lr").setDescription("ROBLOX username OR User ID"))
        .addStringOption(option => option.setName("mr").setDescription("ROBLOX username OR User ID"))
        .addStringOption(option => option.setName("hr").setDescription("ROBLOX username OR User ID"))
        .addStringOption(option => option.setName("exec").setDescription("ROBLOX username OR User ID"))
        .addStringOption(option => option.setName("shr").setDescription("ROBLOX username OR User ID")),
    async execute(interaction, client) {
        if (!interaction.member.roles.cache.get("1098284216749404351")) return await interaction.reply({ content: "You do not have permission to use this command", ephemeral: true })
        const collection = ms.getCollection("OfTheWeeks")
        await interaction.deferReply()
        async function getUser(optionName) {
            let userId = isNaN(Number(optionName)) ? await getIdFromUsername(optionName) : Number(optionName)
            let discorduser
            await fetch(`https://api.blox.link/v4/public/guilds/process.env.MainServerId/roblox-to-discord/${userId}`, {headers: { "Authorization": process.env.BloxlinkAPIKey}}).then(async res => {
                const data = await res.json()
                if (!data.error) {
                    discorduser = await client.guilds.cache.get("process.env.MainServerId").members.fetch(data.discordIDs[0])
                }
                else {
                    discorduser = { user: { id: "0" } }
                }
            })
            return discorduser
        }
        const lrstring = interaction.options.getString("lr")
        const mrstring = interaction.options.getString("mr")
        const hrstr = interaction.options.getString("hr")
        const exestr = interaction.options.getString("exec")
        const shrstr = interaction.options.getString("shr")
        const LR = isNaN(Number(lrstring)) ? Number(await getIdFromUsername(lrstring)) : Number(lrstring)
        const MR = isNaN(Number(mrstring)) ? Number(await getIdFromUsername(mrstring)) : Number(mrstring)
        const HR = isNaN(Number(hrstr)) ? Number(await getIdFromUsername(hrstr)) : Number(hrstr)
        const HRS = isNaN(Number(exestr)) ? Number(await getIdFromUsername(exestr)) : Number(exestr)
        const SHR = isNaN(Number(shrstr)) ? Number(await getIdFromUsername(shrstr)) : Number(shrstr)

        const lrotwrole = "1138266672390733844"
        const mrotwrole = "1138266784139583668"
        const hrotwrole = "1138266837893783655"
        const exotwrole = "1141041726526607452"
        const shrotwrole = "1138266899663311010"
        console.log(LR, MR, HR, HRS, SHR)
        async function setoftheweeks() {
            await collection.updateEntryById("6673070e5b3916d7357467bf", {
                LR: {UserId: LR == 0 ? 44794 : LR, Username: await getUsernameFromId(LR == 0 ? 44794 : LR)},
                MR: {UserId: MR == 0 ? 44794 : MR, Username: await getUsernameFromId(MR == 0 ? 44794 : MR)},
                HR: {UserId: HR == 0 ? 44794 : HR, Username: await getUsernameFromId(HR == 0 ? 44794 : HR)},
                Exec: {UserId: HRS == 0 ? 44794 : HRS, Username: await getUsernameFromId(HRS == 0 ? 44794 : HRS)},
                SHR: {UserId: SHR == 0 ? 44794 : SHR, Username: await getUsernameFromId(SHR == 0 ? 44794 : SHR)}
            })
        }
        retryOperation(setoftheweeks)
        const embed = new EmbedBuilder()
            .setDescription(`LR: ${(LR ?? 'N/A')},\nMR: ${(MR ?? 'N/A')},\nHR: ${(HR ?? 'N/A')},\nExec: ${(HRS ?? 'N/A')},\nSHR: ${(SHR ?? 'N/A')}\nDiscord roles will be removed/added from the old users shortly.`)
            .setColor(0x00ffe5)
        await interaction.followUp({ embeds: [embed] })
        client.guilds.cache.get("process.env.MainServerId").members.fetch().then(async fetched => {
            const ids = fetched.map(m => m)
            for (var i = 0; i < ids.length; i++) {
                const member = ids[i]
                if (member.roles.cache.has(lrotwrole)) {
                    await member.roles.remove(lrotwrole)
                }
                if (member.roles.cache.has(mrotwrole)) {
                    await member.roles.remove(mrotwrole)
                }
                if (member.roles.cache.has(hrotwrole)) {
                    await member.roles.remove(hrotwrole)
                }
                if (member.roles.cache.has(exotwrole)) {
                    await member.roles.remove(exotwrole)
                }
                if (member.roles.cache.has(shrotwrole)) {
                    await member.roles.remove(shrotwrole)
                }
            }
        })
        const lrdisc = await getUser(LR); const mrdisc = await getUser(MR); const hrdisc = await getUser(HR); const exedisc = await getUser(HRS); const shrdisc = await getUser(SHR)
        if (lrdisc.user.id !== "0") await lrdisc.roles.add(lrotwrole)
        if (mrdisc.user.id !== "0") await mrdisc.roles.add(mrotwrole)
        if (hrdisc.user.id !== "0") await hrdisc.roles.add(hrotwrole)
        if (exedisc.user.id !== "0") await exedisc.roles.add(exotwrole)
        if (shrdisc.user.id !== "0") await shrdisc.roles.add(shrotwrole)
    }
}