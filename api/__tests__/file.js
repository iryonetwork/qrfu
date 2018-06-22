let socket = require('../socket');
let multer = require('multer');
const fs = require('fs');

let req, res, next, mockClient, controller;

describe('test file upload', () => {
    beforeEach(() => {
        jest.mock('fs');
        jest.mock('multer');
        multer = require('multer');
        multer.mockImplementation(() => {
            return {single: jest.fn().mockImplementation(() =>
                jest.fn().mockImplementation((req, res, func) => {
                    func(null);
                })
            )};
        });

        controller = require('../controllers/uploadController');

        req = {
            params: {uid: '111'},
            file: {
                filename: 'test.png',
                mimetype: 'image/png'
            },
            connection: {
                localAddress: '127.0.0.1',
                localPort: '3001'
            }
        };

        res = {
            status: jest.fn().mockImplementation(() => {
                return {send: jest.fn(), end: jest.fn()};
            }),
            json: jest.fn(),
            sendStatus: jest.fn(),
        };

        next = jest.fn();

        mockClient = {emit: jest.fn()};
    });

    it('it should upload a file', () => {
        socket.addClient('111', 1, 'image', true, mockClient);
        controller.upload(req, res, next);
        expect(mockClient.emit.mock.calls.length).toEqual(1);
        expect(res.status.mock.calls.length).toEqual(1);
    });

    it('it should upload a file in single file mode', async () => {
        socket.addClient('111', 1, 'image', false, mockClient);
        controller.upload(req, res, next);
        expect(mockClient.emit.mock.calls.length).toEqual(1);
        expect(res.status.mock.calls.length).toEqual(1);
    });

});