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
                    .forEach(data => fs.unlink(`./uploads/${data}`, (er) => {console.log(er)}));

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

exports.mobile = function(req, res) {
    res.sendFile('upload.html', {root: './public'});
};

var uploadFile = function (id, req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            next(err);
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