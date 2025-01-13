export async function getIdFromUsername(username) {
    let userid
    if (!Array.isArray(username)) username = [username]
    fetch("https://users.roblox.com/v1/usernames/users", {
        method: "POST",
        body: JSON.stringify({
            "usernames": username,
            "excludeBannedUsers": true
        })
    }).then(async response => {
        const d = await response.json()
        if (d.data[0]) userid = d.data[0].id
    })
    await new Promise(r => setTimeout(r, 500))
    return userid
}

export async function getUsernameFromId(userId: string | number) {
    const fetchdata = await fetch(`https://users.roblox.com/v1/users/${userId}`)
    const data = await fetchdata.json()

    return {
        displayName: data.displayName,
        name: data.name
    }
}