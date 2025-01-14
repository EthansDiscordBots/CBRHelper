import { Client, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalSubmitInteraction, verifyString, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { QuickDB } from "quick.db";
const db = new QuickDB()
import * as msClient from "marcsync";
const ms = new msClient.Client(process.env.mskey)
const pendingVerifs = ms.getCollection("PendingVerifications")
import { retryOperation } from "../Functions/retry";
import { getIdFromUsername } from "../Functions/getIdFromUsername";
import { getBlurb, getUsernameFromId } from "noblox.js";
const verifiedCollection = ms.getCollection("VerifiedAccounts")
import * as rbx from "noblox.js"
import { updateUser } from "../Functions/updateuser";

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: ButtonInteraction | ModalSubmitInteraction, client: Client) {

        // Choosing Verification Type
        if (interaction.isButton()) {
            const modal = new ModalBuilder()
                .setCustomId("VerificationModal")
                .setTitle("Verification")

            const rblxuser = new TextInputBuilder()
                .setCustomId("rblxUsernameInput")
                .setLabel("What is your roblox username?")
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder("Scr1ptxd_Ethxn")

            if (interaction.customId == "Emojis") {
                const mcom = new ActionRowBuilder<TextInputBuilder>().addComponents(rblxuser)
                modal.addComponents(mcom)
                interaction.showModal(modal)
                await db.set(`${interaction.user.id}.verifMethod`, "Emojis")
            }
            else if (interaction.customId == "Game") {
                const mcom = new ActionRowBuilder<TextInputBuilder>().addComponents(rblxuser)
                modal.addComponents(mcom)
                interaction.showModal(modal)
                await db.set(`${interaction.user.id}.verifMethod`, "Game")
            }
            else if (interaction.customId == "Bloxlink") {
                fetch(`https://api.blox.link/v4/public/guilds/480452557949370380/discord-to-roblox/${interaction.user.id}`, { headers: { "Authorization": process.env.BloxlinkAPIKey } })
                    .then(async (response) => {
                        const data = await response.json()
                        const robloxUserId = data.robloxID
                        if (!robloxUserId) return await interaction.reply({ content: "No verified account found.", ephemeral: true })
                        await db.set(`${interaction.user.id}.verifiedRoblox`, robloxUserId)
                        await db.set(`${robloxUserId}.discordId`, interaction.user.id)
                        async function setVerified() {
                            await verifiedCollection.createEntry({ RobloxUserId: robloxUserId, DiscordUserId: interaction.user.id })
                        }
                        retryOperation(setVerified)
                            .then(result => console.log("Operation succeeded - Set verified user"))
                            .catch(error => console.error("Operation failed:", error.message));
                            const rblxuser = await getUsernameFromId(robloxUserId)
                            if (interaction.channel.id == process.env.VerifyChannel) {
                                await interaction.reply({ content: `Successfully verified as ${rblxuser} (\`${robloxUserId}\`)`, ephemeral: true })
                            } else {
                                await interaction.reply({ content: `Successfully verified as ${rblxuser} (\`${robloxUserId}\`)` })
                            }
                        await updateUser(robloxUserId, interaction.member, rblxuser, interaction)
                    })
            }
        }
        // Submitting Roblox Username
        if (interaction.isModalSubmit() && interaction.customId == "VerificationModal") {
            const robloxUsername = interaction.fields.getTextInputValue("rblxUsernameInput")
            const veriftype = await db.get(`${interaction.user.id}.verifMethod`)
            var robloxuserid
            try {
                robloxuserid = await getIdFromUsername(robloxUsername)
            } catch {
                return await interaction.reply({ content: "Invalid roblox user, please re run the command and try again.", ephemeral: true })
            }
            const confirmbuttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("ConfirmVerification")
                        .setLabel("Finished!")
                        .setStyle(ButtonStyle.Success)
                )

            if (veriftype == "Emojis") {
                function generateRandomWord() {
                    const words = ["Apple", "Banana", "Car", "Dance", "Eagle", "Flower", "Garden", "Hat", "Island",
                        "Juice", "Kite", "Lemon", "Moon", "Notebook", "Ocean", "Pineapple", "Quilt", "Rainbow",
                        "Star", "Tree", "Umbrella", "Violin", "Water", "Xylophone", "Zebra", "Book", "Chocolate",
                        "Dolphin", "Elephant", "Firefly", "Grapes", "Have a cookie", "House", "Igloo", "Jungle", "Koala",
                        "Lollipop", "Mountain", "Nest", "Octopus", "Parrot", "Queen", "Rocket", "Sunshine",
                        "Turtle", "Unicorn", "Valley", "Window", "Yacht", "Zipper", "Balloon", "Developer"]
                    const randomIndex = Math.floor(Math.random() * words.length)
                    return words[randomIndex]
                }
                var emoji_string = ""
                for (let i = 0; i < 20; i++) {
                    if (i >= 1) emoji_string += " "
                    emoji_string = emoji_string + generateRandomWord()
                }
                await db.set(`${interaction.user.id}.emojiString`, emoji_string)
                await db.set(`${interaction.user.id}.pendingRobloxUserId`, robloxuserid)
                await interaction.reply({ content: `Please put the following in your roblox bio. You do not have to delete what you have already.\n\`\`\`${emoji_string}\`\`\`\nOnce the words are in your bio, click the button below. If you wish to cancel, click the button below without the words in your roblox bio.`, ephemeral: true, components: [confirmbuttons] })
            }
            else if (veriftype == "Game") {
                async function makePendingEntry() {
                    await pendingVerifs.createEntry({ RobloxId: robloxuserid, DiscordUsername: interaction.user.username, DiscordId: interaction.user.id, confirmed: false })
                }
                retryOperation(makePendingEntry)
                await interaction.reply({ content: `Please join the [Verification Hub](https://www.roblox.com/games/18504523378/) to confirm your account. One confirmed, click the button below. If you wish to cancel, click the button below without joining the verification hub.`, ephemeral: true, components: [confirmbuttons] })
            }
        }
        // If not bloxlink verif method, check the user has verified in game/put the mojis in roblox bio
        if (interaction.isButton()) {
            if (interaction.customId == "ConfirmVerification") {
                const verifMethod = await db.get(`${interaction.user.id}.verifMethod`)
                if (verifMethod == "Emojis") {
                    const userId = await db.get(`${interaction.user.id}.pendingRobloxUserId`)
                    if ((await getBlurb(userId)).includes(await db.get(`${interaction.user.id}.emojiString`))) {
                        const rblxuser = await getUsernameFromId(userId)
                        if (interaction.channel.id == process.env.VerifyChannel) {
                            await interaction.reply({ content: `Successfully verified as ${rblxuser} (\`${userId}\`)`, ephemeral: true })
                        } else {
                            await interaction.reply({ content: `Successfully verified as ${rblxuser} (\`${userId}\`)` })
                        }

                        await interaction.reply({ content: `Successfully verified as ${rblxuser} (\`${userId}\`)` })
                        await db.set(`${interaction.user.id}.verifiedRoblox`, userId)
                        await db.set(`${userId}.discordId`, interaction.user.id)
                        await updateUser(userId, interaction.member, rblxuser, interaction)
                    }
                    else {
                        return await interaction.reply({ content: "Words not found in bio. Removing verification request.", ephemeral: true })
                    }
                }
                else if (verifMethod == "Game") {
                    var entry
                    async function getPendingEntry() {
                        return await pendingVerifs.getEntries({ DiscordId: interaction.user.id })
                    }
                    retryOperation(getPendingEntry)
                        .then(response => entry = response)
                    await new Promise(r => setTimeout(r, 2000))
                    async function deletePending() {
                        await pendingVerifs.deleteEntries({ DiscordId: interaction.user.id })
                    }
                    if (entry[0].getValue("confirmed")) {
                        const rblxuser = await getUsernameFromId(entry[0].getValue("RobloxId"))
                        if (interaction.channel.id == process.env.VerifyChannel) {
                            await interaction.reply({ content: `Successfully verified as ${rblxuser} (\`${entry[0].getValue("RobloxId")}\`)`, ephemeral:true })
                        }
                        else {
                            await interaction.reply({ content: `Successfully verified as ${rblxuser} (\`${entry[0].getValue("RobloxId")}\`)` })
                        }
                        await updateUser(entry[0].getValue("RobloxId"), interaction.member, rblxuser, interaction)
                        await db.set(`${interaction.user.id}.verifiedRoblox`, entry[0].getValue("RobloxId"))
                        await db.set(`${entry[0].getValue("RobloxId")}.discordId`, interaction.user.id)
                        async function createVerified() {
                            await verifiedCollection.createEntry({ RobloxId: robloxuserid, DiscordId: interaction.user.id })
                        }
                        retryOperation(createVerified)
                        retryOperation(deletePending)

                    }
                    if (!entry[0].getValue("confirmed")) {
                        retryOperation(deletePending)
                        return await interaction.reply({ content: "Account was not confirmed in the game. Removing verification request.", ephemeral: true })

                    }
                }
                await db.delete(`${interaction.user.id}.pendingRobloxUserId`)
                await db.delete(`${interaction.user.id}.verifMethod`)
                await db.delete(`${interaction.user.id}.emojiString`)
            }
        }
    },
};