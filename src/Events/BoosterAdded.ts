import { ActivityType, PresenceUpdateStatus, PermissionsBitField, ChannelType, EmbedBuilder, Events, MessageType } from "discord.js";
import { Client } from "marcsync";
const ms = new Client(String(process.env.mskey))
const date = new Date()
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
            if (!newMember.roles.cache.get("929165612188590091")) {
                
                fetch(`https://api.blox.link/v4/public/guilds/480452557949370380/discord-to-roblox/${oldMember.user.id}`, { headers: { "Authorization": process.env.BloxlinkAPIKey } }).then(async res => {
                    const data = await res.json()
                    async function retryOperation(operation, maxRetries = 3, delay = 1000) {
                        for (let retry = 0; retry < maxRetries; retry++) {
                            try {
                                return await operation();
                            } catch (error) {
                                console.error(`Attempt ${retry + 1} failed:`, error);
                                await new Promise(resolve => setTimeout(resolve, delay));
                            }
                        }
                        throw new Error(`Operation failed after ${maxRetries} retries`);
                    }
                    
                    // Example usage:
                    async function someOperation() {
                        if ((await ms.getCollection("Boosters").getEntries({UserId: data.robloxID})).length > 0)ms.getCollection("Boosters").deleteEntries({UserId: data.robloxID})
                    }
                    
                    retryOperation(someOperation)
                        .then(result => console.log("Operation succeeded"))
                        .catch(error => console.error("Operation failed:", error.message));                    
                    
                })
            }
            else if (newMember.roles.cache.get("929165612188590091")) {
                fetch(`https://api.blox.link/v4/public/guilds/480452557949370380/discord-to-roblox/${oldMember.user.id}`, { headers: { "Authorization": process.env.BloxlinkAPIKey } }).then(async res => {
                    const data = await res.json()
                    async function retryOperation(operation, maxRetries = 3, delay = 1000) {
                        for (let retry = 0; retry < maxRetries; retry++) {
                            try {
                                return await operation();
                            } catch (error) {
                                console.error(`Attempt ${retry + 1} failed:`, error);
                                await new Promise(resolve => setTimeout(resolve, delay));
                            }
                        }
                        throw new Error(`Operation failed after ${maxRetries} retries`);
                    }
                    
                    
                    async function someOperation() {
                        if ((await ms.getCollection("Boosters").getEntries({UserId: data.robloxID})).length < 1) ms.getCollection("Boosters").createEntry({UserId: data.robloxID})
                    }
                    
                    retryOperation(someOperation)
                        .then(result => console.log("Operation succeeded"))
                        .catch(error => console.error("Operation failed:", error.message));                    
                    
                    
                })
            }
        })
    }
}