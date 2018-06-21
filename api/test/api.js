let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let app = require('../app');
let socket = require('../socket');

let formData;

chai.use(chaiHttp);

describe('/GET api information', () => {
    it('it should GET an id and url', (done) => {
        chai.request(app)
            .get('/api/fetch')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.uid.should.be.a('string');
                res.body.url.should.be.a('string');
                done();
            });
    });

    it('it should GET uid metadata', (done) => {
        socket.addId('222', 1, 'image', true, {send: () => {}});

        chai.request(app)
            .get(`/api/info/222`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.ratio.should.equal(1);
                res.body.filetype.should.equal('image');
                res.body.multiple.should.equal(true);
                done();
            });
    });

    it('it should fail to GET uid metadata', (done) => {
        chai.request(app)
            .get('/api/info/111')
            .end((err, res) => {
                res.should.have.status(500);
                res.text.should.equal('no id');
                done();
            });
    });
});

describe('/POST file to upload', () => {
    it('it should POST a file', (done) => {
        socket.addId('222', 1, 'image', true, {emit: () => {}});

        chai.request(app)
            .post('/api/upload/222')
            .attach('file', './test/test.png', 'test.png')
            .then((res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('it should fail to POST a file', (done) => {
        chai.request(app)
            .post('/api/upload/111')
            .attach('file', './test/test.png', 'test.png')
            .then((res) => {
                res.should.have.status(500);
                res.text.should.equal('no id');
                done();
            });
    });
});