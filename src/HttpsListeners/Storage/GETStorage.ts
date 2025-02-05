import { QuickDB } from "quick.db";
const db = new QuickDB();
import { EmbedBuilder } from "discord.js";

module.exports = {
    method: 'patch',
    directory: "/storage/:location",
    authNeeded: true,
    async execute(req, res) {
        const { location } = req.params
        const { filters } = req.body

        if (!location) return res.status(400).json("No location found")

        let potentialReturn = await db.get(`serverStorage.${location}`)
        if (!potentialReturn) potentialReturn = {}
        if (!filters) return res.status(200).json(potentialReturn)
        if (typeof (filters) != "object") return res.status(400).json("Filter must be a json")

        const filteredData = potentialReturn.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                return item[key] === value;
            });
        });

        return res.status(200).json(filteredData);
    },
}

