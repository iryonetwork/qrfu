'use strict';

module.exports = function(app) {
    var upload = require('../controllers/uploadController');

    app.route('/api/fetch')
        .get(upload.fetch);

    app.route('/api/upload/:uid')
        .post(upload.upload);

    app.route('/api/file/:name')
        .get(upload.download);
    
    app.route('/ui/:uid')
        .get(upload.mobile);
}