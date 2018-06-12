'use strict';

const multer = require('multer');
const path = require('path');
const crypto = require("crypto");
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const newFilename = `${req.params.uid}-${file.originalname}`;
        cb(null, newFilename);
    },
    fileFilter: function(req, file, cb) {
        var type = clients[req.params.uid].filetype;

        if (type === "all" || file.mimetype.startsWith(type)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});
const upload = multer({ storage }).single('file');

exports.fetch = function(req, res) {
    const uid = crypto.randomBytes(16).toString("hex");
    const url = `${req.connection.localAddress}:${req.connection.localPort}`;
    let imageData = {url: url, uid: uid};
    res.json(imageData);
};

exports.upload = function(req, res, next) {
    const id = req.params.uid;

    if (!clients[id]) {
        res.status(500).send("no id");
    } else {
        if (!clients[id].multiple) {
            fs.readdir('./uploads', (error, files) => {
                if (error) {
                    throw error;
                }
            
                files.filter(name => name.startsWith(id))
                    .forEach(data => fs.unlink(`./uploads/${data}`, (er) => {console.log(er)}));
            });
        }

        upload(req, res, function(err) {
            if (err) {
                next(err);
            } else {
                const name = req.file.filename;
                const url = `http://${req.connection.localAddress}:${req.connection.localPort}/api/file/${name}`;
                var type = "image";
                
                if (req.file.mimetype.startsWith("audio")) {
                    type = "audio";
                }

                clients[id].emit('messages', {name: name, type: type, url: url, uid: id});
                res.status(200).end();
            }
        });
    }
};

exports.info = function(req, res) {
    const id = req.params.uid;

    if (!clients[id]) {
        res.status(500).send("no id");
    } else {
        let uploadData = {
            ratio: clients[id].ratio,
            filetype: clients[id].filetype,
            multiple: clients[id].multiple,
        };
        res.json(uploadData);
    }
};

exports.download = function(req, res) {
    const name = req.params.name;
    res.sendFile(`${name}`, {root: './uploads'});
};

exports.mobile = function(req, res) {
    res.sendFile('upload.html', {root: './public'});
};