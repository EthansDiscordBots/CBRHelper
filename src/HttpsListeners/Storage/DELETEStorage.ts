import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'delete',
    directory: "/storage/:location",
    authNeeded: true,
    async execute(req, res) {
        const { location } = req.params
        const { filters } = req.body

        if (!location) return res.status(400).json("No location found")

        const potentialReturn = await db.get(`serverStorage.${location}`) || {}

        if (!filters) {await db.delete(`serverStorage.${location}`); res.status(200).json({message: "Collection deleted"}); return}
        if (typeof (filters) != "object") return res.status(400).json("Filter must be a json")

        const updatedData = potentialReturn.filter(item => {
            return !Object.entries(filters).every(([key, value]) => item[key] === value);
        });

        await db.set(`serverStorage.${location}`, updatedData);

        return res.status(200).json({ message: "Entries deleted", deletedCount: potentialReturn.length - updatedData.length });
    },
}

