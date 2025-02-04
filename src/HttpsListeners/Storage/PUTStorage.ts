import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'put',
    directory: "/storage/:location",
    authNeeded: true,
    async execute(req, res) {
        const { location } = req.params
        const { filters, update } = req.body

        if (!location) return res.status(400).json("No location found");

        let potentialReturn = await db.get(`serverStorage.${location}`) || [];
        if (!filters || typeof filters !== "object") return res.status(400).json("Filter must be a JSON object");
        if (!update || typeof update !== "object") return res.status(400).json("Update data must be a JSON object");

        let updatedCount = 0;
        const updatedData = potentialReturn.map(item => {
            if (Object.entries(filters).every(([key, value]) => item[key] === value)) {
                updatedCount++;
                return { ...item, ...update };
            }
            return item;
        });
        await db.set(`serverStorage.${location}`, updatedData);
    
        return res.status(200).json({ message: "Entries updated", updatedCount });
    },
}

