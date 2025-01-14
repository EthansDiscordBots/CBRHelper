import { SlashCommandBuilder, EmbedBuilder, Embed } from "discord.js"
import { Client, Collection, Entry, EntryData } from "marcsync"
const ms = new Client(String(process.env.mskey))
import { retryOperation } from "../../Functions/retry"
import { getIdFromUsername } from "../../Functions/getIdFromUsername"
import { getUsernameFromId } from "noblox.js"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("crystals")
        .setDescription(".")
        .addSubcommand(o => o
            .setName("add")
            .setDescription("add crystals to someones balance")
            .addStringOption(o => o.setName("name-or-id").setDescription("The roblox username or roblox id of the persons balance you are changing").setRequired(true))
            .addIntegerOption(o => o.setName("add-amount").setDescription("The amount of crystals you wish to add to this users balance").setRequired(true))
        )
        .addSubcommand(o => o
            .setName("remove")
            .setDescription("remove crystals from someones balance")
            .addStringOption(o => o.setName("name-or-id").setDescription("The roblox username or roblox id of the persons balance you are changing").setRequired(true))
            .addIntegerOption(o => o.setName("remove-amount").setDescription("The amount of crystals you wish to remove from this users balance").setRequired(true))
        )
        .addSubcommand(o => o
            .setName("set")
            .setDescription("set someones balance to")
            .addStringOption(o => o.setName("name-or-id").setDescription("The roblox username or roblox id of the persons balance you are changing").setRequired(true))
            .addIntegerOption(o => o.setName("amount").setDescription("The amount of crystals you wish to set this users balance to").setRequired(true))
        )
        .addSubcommand(o => o
            .setName("check")
            .setDescription("Check someones crystal balance")
            .addStringOption(o => o.setName("name-or-id").setDescription("The roblox username or roblox id of the persons balance you are changing").setRequired(true))
        ),
    async execute(interaction, client) {
        await interaction.deferReply()
        var userid = interaction.options.getString("name-or-id")
        if (Number(userid)) userid = Number(userid)
        else userid = await getIdFromUsername(userid)
        var change
        var set = false
        const command = interaction.options.getSubcommand()
        interface CrystalsPending extends EntryData {
            PendingChange: number,
            UserId: number
        }
        interface Crystals extends EntryData {
            Crystals: number,
            UserId: number
        }
        var crystalcol: Collection<CrystalsPending>
        async function getcol() {
            crystalcol = ms.getCollection("CrystalsPendingChange")
        }

        retryOperation(getcol)
        var alreadypending
        async function getPlayerCrystals() {
            alreadypending = await crystalcol.getEntries({ UserId: userid })
        }
        retryOperation(getPlayerCrystals)
        await new Promise(r => setTimeout(r, 1000))

        switch (command) {
            case "check":
                var maincoll: Collection<Crystals>
                var alrbal
                async function maincol() {
                    maincoll = ms.getCollection("PlayerCrystals")
                }
                retryOperation(maincol)

                async function PlayerCrysMain() {
                    alrbal = await maincoll.getEntries({UserId: userid})
                }
                retryOperation(PlayerCrysMain)
                await new Promise(r => setTimeout(r, 1000))
                const reply_embed = new EmbedBuilder()
                .addFields(
                    {name: "Main balance", value: String(alrbal[0]?.getValue("Crystals") || 0), inline: true},
                    {name: "Pending", value: `${alreadypending[0]?.getValue("set") ? `set to ` : ""}${alreadypending[0]?.getValue("PendingChange") || 0}`, inline: true},
                    {name: "Total Balance", value: `${alreadypending[0]?.getValue("set") ? alreadypending[0]?.getValue("PendingChange") : (alreadypending[0]?.getValue("PendingChange") || 0) + (alrbal[0]?.getValue("Crystals") || 0)}`, inline: true})
                .setColor(0x00ffe5)
                return await interaction.followUp({embeds: [reply_embed]})
        }

        if (!interaction.member.roles.cache.get(process.env.MAINSHR)) return await interaction.reply({ content: "You do not have permission to use this command", ephemeral: true })

        switch (command) {
            case "remove":
                change = interaction.options.getInteger("remove-amount")
                change /= -1
        }
        switch (command) {
            case "add":
                change = interaction.options.getInteger("add-amount")
        }
        switch (command) {
            case "set":
                change = interaction.options.getInteger("amount")
                set = true
        }
        if (alreadypending.length > 0) {
            var pen = alreadypending[0].getValue("PendingChange")
            async function update() {
                if (set) pen = 0
                crystalcol.updateEntries({ UserId: userid }, { PendingChange: pen + change, set: (alreadypending[0].getValue("set") || set) })
            }

            retryOperation(update)
        }
        else {
            async function create() {
                crystalcol.createEntry({ UserId: userid, PendingChange: change, set: set })
            }
            retryOperation(create)

        }
        const embed = new EmbedBuilder()
            .addFields(
                { name: "User Ran", value: `<@${interaction.user.id}>`, inline: true },
                { name: "Set to value?", value: `${set}`, inline: true },
                { name: "Change by", value: String(change), inline: true },
                { name: "User getting managed", value: `${await getUsernameFromId(userid)} // \`${userid}\``, inline: true }
            )
            .setColor(0x00ffe5)
        const reply_embed = new EmbedBuilder()
            .setDescription(`${await getUsernameFromId(userid)} // \`${userid}\` has had their ballance ${set ? 'set to' : 'changed by'} ${change}`)
            .setColor(0x00ffe5)
        await interaction.followUp({ embeds: [reply_embed] })
        client.channels.cache.get(process.env.CrystalManageLogs).send({ embeds: [embed] })
    }
}