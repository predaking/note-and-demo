const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../assets'));
    },
    filename: function (req, file, cb) {
        cb(null, Buffer.from(file.originalname, 'latin1').toString('utf-8'))
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('debug: ', req.body);
    res.send('Hello');
    next();
});

app.listen(port, () => {
    console.log("port: ", port);
});
