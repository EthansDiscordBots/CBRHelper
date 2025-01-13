import { SlashCommandBuilder, EmbedBuilder, WorkerBootstrapper } from "discord.js";
import { Client, Collection, Entry, EntryData} from "marcsync";
const ms = new Client(String(process.env.mskey))
import { retryOperation} from "../../Functions/retry"
import { getUsernameFromId } from "noblox.js";
import { getIdFromUsername } from "../../Functions/getIdFromUsername";
const blacklistcol = ms.getCollection("Blacklisted")
module.exports = {
    data: new SlashCommandBuilder()
      .setName("blacklist")
      .setDescription("Manage someones blacklist from cbr services")
      .addStringOption(o=>o.setName("rblx-username").setDescription("The roblox username of the person you are attempting to blacklist").setRequired(true))
      .addStringOption(i => i .setName("place").setDescription("The place you are blacklisting them from").setRequired(true).setChoices({name: "Application centre", value:"Application centre"}, {name: "Ranking centre", value: "Ranking centre"}))
      .addBooleanOption(i => i.setName("add").setDescription("wether you are adding or revoking the blacklist from this person - True means adding").setRequired(true))
      .addStringOption(i => i .setName("reason").setDescription("the reason you are blacklisting the user from using this service")),
      async execute(interaction, client) {
        await interaction.deferReply({ephemeral: true})
        const robloxusername = interaction.options.getString("rblx-username")
        const place=  interaction.options.getString("place")
        const add = interaction.options.getBoolean("add")
        const reason = interaction.options.getString("reason")

        if (add && !reason) return await interaction.followUp("You must have a reason if you are adding a blacklist to a user")
        const userid = await getIdFromUsername(robloxusername)
        await new Promise(r => setTimeout(r, 500))
        var entries

        async function b() {
            return await blacklistcol.getEntries({userId: userid, place: place})
        }
        retryOperation(b)
        .then(r => entries = r)
        .catch(r => console.error("Operation failed:", r.message))

        await new Promise(r => setTimeout(r, 1000))
        if (entries.length > 0 && add) return await interaction.followUp("This user is already blacklisted from this service")
        if (entries.length < 1 && !add) return await interaction.followUp("This user is not currently blacklisted from this service")
        if (add) {
            async function addd() {
                await blacklistcol.createEntry({userId: userid, place:place, reason:reason})
            }

            retryOperation(addd)
            .then(r => interaction.followUp(`${robloxusername} (\`${userid}\`) has successfully been blacklisted from the ${place} for \`${reason}\``))
            .catch(r => {console.error("Operation failed:", r.message)
            interaction.followUp(`There was an error blacklisting ${robloxusername} (\`${userid}\`) from the ${place}`)
            })
        }
        else if (!add) {
            async function remove() {
                await blacklistcol.deleteEntries({userId: userid, place:place})
            }

            retryOperation(remove)
            .then(r => interaction.followUp(`${robloxusername} (\`${userid}\`) has successfully been unblacklisted from the ${place}`))
            .catch(r => {console.error("Operation failed:", r.message)
            interaction.followUp(`There was an error unblacklisting ${robloxusername} (\`${userid}\`) from the ${place}`)
            })
        }
    }    
} 