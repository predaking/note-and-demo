const express = require("express");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("hello World; 你好");
    res.redirect()
});

app.listen(port, () => {
    console.log("port: ", port);
});