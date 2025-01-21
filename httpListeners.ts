import { deployListeners } from "./src/Functions/deployListeners";
const express = require("express");

const app = express();
const PORT = 5000; // Use any available port

deployListeners(app)

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Webhook listener running on port ${PORT}`);
});