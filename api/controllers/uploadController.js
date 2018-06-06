'use strict';

const multer = require('multer');
const path = require('path');
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const newFilename = `${crypto.randomBytes(16).toString("hex")}-${file.originalname}`;
        cb(null, newFilename);
    },
});
const upload = multer({ storage }).single('file');

exports.fetch = function(req, res) {
    const id = crypto.randomBytes(16).toString("hex");
    const url = `${req.connection.localAddress}:${req.connection.localPort}`;
    let image_data = {url: url, uid: id};
    res.json(image_data);
};

exports.upload = function(req, res, next) {
    const id = req.params.uid;
    
    console.log(Object.keys(clients));

    if (!clients[id]) {
        res.status(500).send("no id");
    } else {
        upload(req, res, function(err) {
            if (err) {
                next(err);
            } else {
                const name = req.file.filename;

                clients[id].emit('messages', {name: name});
                res.status(200).end();
            }
        });
    }
};

exports.download = function(req, res) {
    const name = req.params.name;
    res.sendFile(`${name}`, {root: './uploads'});
};

exports.mobile = function(req, res) {
    res.sendFile('upload.html', {root: './public'});
};