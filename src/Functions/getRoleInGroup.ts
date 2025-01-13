export async function getRoleInGroup(groupId, userid) {
    let RankName, rank
    await fetch(`https://groups.roblox.com/v2/users/${userid}/groups/roles`).then(async res => {
        const data = await res.json()
        let targetGroupEntry = data.data.find((entry) => {return Number(entry.group.id) == Number(groupId)});
        if (targetGroupEntry) {
            RankName = targetGroupEntry.role.name
            rank = targetGroupEntry.role.rank
        }
        else {
            RankName = "Guest"
            rank = 0
        }
    })
    return {"rank": rank, "RankName": RankName}
}