let xcsrf

export async function setRank(cookie, groupId, userid, newrank) {
    let newrankid

    
    if (Number.isNaN(Number(newrank))) {
        const roles = (await fetch(`https://groups.roblox.com/v1/groups/${groupId}/roles`).then(async res => {
            const data = await res.json()
            return data.roles
        }))
        for (let i = 0; i < roles.length; i++) {
            const roleName = roles[i].name;
            if (roleName == newrank) {
                newrankid = roles[i].id
            }
        }
    }
    else if (Number(newrank) <= 255) {
        const roles = await fetch(`https://groups.roblox.com/v1/groups/${groupId}/roles`).then(async res => {
            const data = await res.json()
            return data.roles
        })
        console.log(newrank)
        for (let i = 0; i < roles.length; i++) {
            const rolerank = roles[i].rank;
            console.log(rolerank)
            if (rolerank == Number(newrank)) {
                newrankid = roles[i].id
            }
        }
    }
    else newrankid = Number(newrank)

    fetch(`https://groups.roblox.com/v1/groups/${groupId}/users/${userid}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': xcsrf,
            "Cookie": `.ROBLOSECURITY=${cookie}`
        },
        body: JSON.stringify({
            "roleId": newrankid
        })
    }).then(async res => {
        if (res.status == 403) {
            xcsrf = res.headers.get("x-csrf-token")
            await setRank(cookie, groupId, userid, newrankid)
        }
    })
}
