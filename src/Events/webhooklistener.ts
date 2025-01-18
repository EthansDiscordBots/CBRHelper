const express = require("express")
const bodyParser = require("body-parser");

const app = express()
const PORT = 80
app.use(bodyParser.json())

app.get("/test", (req, res) => {
    const body = req.body

    res.json().status(200).send(JSON.stringify({
        "success": true
    }))
})

app.listen(PORT)