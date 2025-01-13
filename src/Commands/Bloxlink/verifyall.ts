import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction } from "discord.js"
import { QuickDB } from "quick.db"
import { updateUser } from "../../Functions/updateuser"
import { getUsernameFromId } from "noblox.js"
const db = new QuickDB()
import { Client as Marc } from "marcsync"
const ms = new Marc(process.env.mskey)
const verifiedCollection = ms.getCollection("VerifiedAccounts")
import { retryOperation } from "../../Functions/retry"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verify-all")
        .setDescription("Verify everyone on the bot and update those who are already"),
    async execute(interaction: CommandInteraction, client) {
        client.guilds.cache.get(process.env.MainServerId).members.fetch().then(async members => {
            const ids = members.map(m => m)
            await interaction.reply({content: `Scanning server. Estimated time until completion ${Math.floor((5 * ids.length) / 60)} minutes`})
            for (var i = 0; i < ids.length; i++) {
                await new Promise(r => setTimeout(r, 3000))
                const member = ids[i]
                const id = await db.get(`${member.user.id}.verifiedRoblox`)
                if (id) {
                    await updateUser(id, member, await getUsernameFromId(id), interaction)
                }
                else {
                    fetch(`https://api.blox.link/v4/public/guilds/${process.env.MainServerId/discord-to-roblox}/${member.user.id}`, { headers: { "Authorization": process.env.BloxlinkAPIKey } })
                        .then(async (response) => {
                            const data = await response.json()
                            const robloxUserId = data.robloxID
                            if (!robloxUserId) return client.channels.cache.get("1181701599278669834").send({content: `Unable to find a roblox account for <@${member.user.id}>`, allowedMentions: {} })
                            await db.set(`${member.user.id}.verifiedRoblox`, robloxUserId)
                            await db.set(`${robloxUserId}.discordId`, member.user.id)
                            async function setVerified() {
                                await verifiedCollection.createEntry({ RobloxUserId: robloxUserId, DiscordUserId: member.user.id })
                            }
                            retryOperation(setVerified)
                                .then(result => console.log("Operation succeeded - Set verified user"))
                                .catch(error => console.error("Operation failed:", error.message));
                            const rblxuser = await getUsernameFromId(robloxUserId)
                            await client.channels.cache.get("1181701599278669834").send({content: `Successfully linked <@${member.user.id}> as [${rblxuser} (${robloxUserId})](<https://www.roblox.com/users/${robloxUserId}/profile>)`,  allowedMentions: {} })
                            await updateUser(robloxUserId, member, rblxuser, interaction)
                        })
                }
                if (i == ids.length - 1) interaction.channel.send("Server scan complete.")
            }
        })
    }
}