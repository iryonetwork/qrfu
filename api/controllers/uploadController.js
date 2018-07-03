'use strict';

const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const socket = require('../socket');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const newFilename = `${req.params.uid}-${file.originalname}`;
        cb(null, newFilename);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100000000,
    },
    fileFilter: function(req, file, cb) {
        var type = socket.getFiletype(req.params.uid);

        if ((type === 'all' && (file.mimetype.startsWith('image') || file.mimetype.startsWith('audio')))
                || file.mimetype.startsWith(type)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
}).single('file');

exports.fetch = function(req, res) {
    const uid = crypto.randomBytes(16).toString('hex');
    const url = `${req.connection.localAddress}:${req.connection.localPort}`;
    let imageData = {url: url, uid: uid};
    res.json(imageData);
};

exports.upload = function(req, res, next) {
    const id = req.params.uid;

    if (!socket.isValid(id)) {
        res.status(500).send('no id');
    } else {
        if (!socket.isMultiple(id)) {
            // remove other files if user can only upload one file
            fs.readdir('./uploads', (error, files) => {
                if (error) {
                    throw error;
                }
                
                files.filter(name => name.startsWith(id))
                    .forEach(data => fs.unlink(`./uploads/${data}`, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    }));

                uploadFile(id, req, res, next);
            });
        } else {
            uploadFile(id, req, res, next);
        }
    }
};

exports.info = function(req, res) {
    const id = req.params.uid;

    if (!socket.isValid(id)) {
        res.status(500).send('no id');
    } else {
        let uploadData = {
            ratio: socket.getRatio(id),
            filetype: socket.getFiletype(id),
            multiple: socket.isMultiple(id),
        };
        res.json(uploadData);
        socket.notifyConnected(id);
    }
};

exports.download = function(req, res) {
    const name = req.params.name;
    res.sendFile(`${name}`, {root: './uploads'}, (err) => {
        if (err) {
            res.sendStatus(404);
        }
    });
};

exports.delete = function(req, res) {
    const name = req.params.name;

    fs.unlink(`./uploads/${name}`, (err) => {
        if (err) {
            res.status(500).end();
        } else {
            res.status(200).end();
        }
    });
};

exports.mobile = function(req, res) {
    res.sendFile('upload.html', {root: './public'});
};

var uploadFile = function (id, req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            next(err);
        } else if (!req.file) {
            res.status(500).end();
        } else {
            const name = req.file.filename;
            const url = `http://${req.connection.localAddress}:${req.connection.localPort}/api/file/${name}`;
            var type = 'none';
            
            if (req.file.mimetype.startsWith('audio')) {
                type = 'audio';
            } else if (req.file.mimetype.startsWith('image')) {
                type = 'image';
            }

            socket.send(id, name, type, url);
            res.status(200).end();
        }
    });
}