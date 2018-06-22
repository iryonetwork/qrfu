let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let socket = require('../socket');

let formData;

chai.use(chaiHttp);

describe('/GET api information', () => {
    it('it should GET an id and url', (done) => {
        chai.request(app)
            .get('/api/fetch')
            .end((err, res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('uid');
                expect(res.body).toHaveProperty('url');
                done();
            });
    });

    it('it should GET uid metadata', (done) => {
        socket.addClient('222', 1, 'image', true, {send: () => {}});

        chai.request(app)
            .get(`/api/info/222`)
            .end((err, res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body.ratio).toBe(1);
                expect(res.body.filetype).toBe('image');
                expect(res.body.multiple).toBe(true);
                done();
            });
    });

    it('it should fail to GET uid metadata', (done) => {
        chai.request(app)
            .get('/api/info/111')
            .end((err, res) => {
                expect(res.statusCode).toBe(500);
                expect(res.text).toBe('no id');
                done();
            });
    });
});

describe('/POST file to upload', () => {
    it('it should POST a file', (done) => {
        socket.addClient('222', 1, 'image', true, {emit: () => {}});

        chai.request(app)
            .post('/api/upload/222')
            .attach('file', './__tests__/test.png', 'test.png')
            .then((res) => {
                expect(res.statusCode).toBe(200);
                done();
            });
    });

    it('it should fail to POST a file', (done) => {
        chai.request(app)
            .post('/api/upload/111')
            .attach('file', './__tests__/test.png', 'test.png')
            .then((res) => {
                expect(res.statusCode).toBe(500);
                expect(res.text).toBe('no id');
                done();
            });
    });
});