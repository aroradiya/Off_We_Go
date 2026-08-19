const express = require("express");

const app = express();

const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to OffWeGo API"
    });
});

app.listen(PORT, () => {
    console.log(`OffWeGo server running on http://localhost:${PORT}`);
});