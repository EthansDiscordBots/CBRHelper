export async function getRobloxIdFromDiscord(DiscordId: number) {
    const response = await fetch(`https://api.blox.link/v4/public/guilds/480452557949370380/discord-to-roblox/${DiscordId}`, { 
        headers: { "Authorization": String(process.env.BloxlinkAPIKey) } 
    });
    const data = await response.json();
    return data.robloxID;
}