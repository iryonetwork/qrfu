import React from 'react';
import enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Upload from './Upload';
import UploadList from '../UploadList';

enzyme.configure({ adapter: new Adapter() });

let wrapper, socket;

beforeEach(() => {
    jest.mock('../UploadList', () => () => <ul></ul>);
    jest.mock('./UploadDisplay', () => 'UploadDisplay');
        
    const fetchData = {json: function() {
        return {url: '127.0.0.1:3000/ui/123', uid: '123'}
    }};
    
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve(fetchData));
});

describe('Testing with multiple=true', () => {

    beforeEach(() => {
        const file = {
            name: 'file-img',
            url: 'http://localhost:3001/',
            uid: '123',
            type: 'image',
        };

        socket = {
            join: jest.fn(),
            receive: jest.fn().mockImplementation((func) => func(file)),
            disconnect: jest.fn(),
        };

        wrapper = mount(
            <Upload ratio={0} filetype='image' multiple={true} uploadlist={UploadList} socket={socket} />
        );
    });

    test('Upload should load correctly', () => {
        expect(wrapper.props().ratio).toEqual(0);
        expect(wrapper.props().filetype).toBe('image');
        expect(wrapper.props().multiple).toEqual(true);
        expect(wrapper.find('UploadDisplay').length).toEqual(1);
    });

    test('Upload should connect to socket', async () => {
        wrapper.update();
        expect(socket.join.mock.calls.length).toEqual(1);
    });

    test('Upload should receive file', async () => {
        wrapper.update();
        expect(socket.receive.mock.calls.length).toEqual(1);
        expect(wrapper.state().uploads.length).toEqual(1);
    });

});

describe('Testing with multiple=false', () => {

    beforeEach(() => {
        const files = [
            {
                name: 'file-img',
                url: 'http://localhost:3001/',
                uid: '123',
                type: 'image',
            },
            {
                name: 'file-audio',
                url: 'http://localhost:3001/',
                uid: '123',
                type: 'audio',
            }
        ];
        
        socket = {
            join: jest.fn(),
            receive: jest.fn().mockImplementation((func) => {
                    func(files[0]);
                    func(files[1]);
                }),
            disconnect: jest.fn(),
        };

        wrapper = mount(
            <Upload ratio={0} filetype='all' multiple={false} uploadlist={UploadList} socket={socket} />
        );
    });

    test('Upload should overwrite first file', async () => {
        wrapper.update();
        expect(socket.receive.mock.calls.length).toEqual(1);
        expect(wrapper.state().uploads.length).toEqual(1);
        expect(wrapper.state().uploads[0].name).toBe('file-audio');
    });

});

describe('Testing file name check', () => {

    beforeEach(() => {
        const files = [
            {
                name: 'file-img',
                url: 'http://localhost:3001/',
                uid: '123',
                type: 'image',
            },
            {
                name: 'file-img',
                url: 'http://localhost:3001/',
                uid: '123',
                type: 'audio',
            }
        ];

        socket = {
            join: jest.fn(),
            receive: jest.fn().mockImplementation((func) => {
                func(files[0]);
                func(files[1]);
            }),
            disconnect: jest.fn(),
        };

        wrapper = mount(
            <Upload ratio={0} filetype='all' multiple={true} uploadlist={UploadList} socket={socket} />
        );
    });

    test('Upload should overwrite first file', async () => {
        wrapper.update();
        expect(socket.receive.mock.calls.length).toEqual(1);
        expect(wrapper.state().uploads.length).toEqual(1);
        expect(wrapper.state().uploads[0].type).toBe('audio');
    });

});

describe('Testing file type check', () => {

    beforeEach(() => {
        const files = [
            {
                name: 'file-aud',
                url: 'http://localhost:3001/',
                uid: '123',
                type: 'audio',
            },
            {
                name: 'file-2',
                url: 'http://localhost:3001/',
                uid: '123',
                type: 'none',
            }
        ];

        socket = {
            join: jest.fn(),
            receive: jest.fn().mockImplementation((func) => {
                func(files[0]);
                func(files[1]);
            }),
            disconnect: jest.fn(),
        };

        wrapper = mount(
            <Upload ratio={0} filetype='image' multiple={true} uploadlist={UploadList} socket={socket} />
        );
    });

    test('Upload should not have any files', async () => {
        wrapper.update();
        expect(socket.receive.mock.calls.length).toEqual(1);
        expect(wrapper.state().uploads.length).toEqual(0);
    });

});

describe('Testing file uid', () => {

    beforeEach(() => {
        const files = [
            {
                name: 'file-img',
                url: 'http://localhost:3001/',
                uid: '123',
                type: 'image',
            },
            {
                name: 'file-img-2',
                url: 'http://localhost:3001/',
                uid: '123123',
                type: 'image',
            }
        ];

        socket = {
            join: jest.fn(),
            receive: jest.fn().mockImplementation((func) => {
                func(files[0]);
                func(files[1]);
            }),
            disconnect: jest.fn(),
        };

        wrapper = mount(
            <Upload ratio={0} filetype='image' multiple={true} uploadlist={UploadList} socket={socket} />
        );
    });

    test('Upload should ignore file with incorrect uid', async () => {
        wrapper.update();
        expect(socket.receive.mock.calls.length).toEqual(1);
        expect(wrapper.state().uploads.length).toEqual(1);
    });

});

describe('Testing socket disconnect', () => {

    beforeEach(() => {
        socket = {
            join: jest.fn().mockImplementation(
                (uid, ratio, filetype, multiple, onDisconnect, onReconnect) => onDisconnect()),
            receive: jest.fn(),
            disconnect: jest.fn(),
        };

        wrapper = mount(
            <Upload ratio={0} filetype='image' multiple={true} uploadlist={UploadList} socket={socket} />
        );
    });

    test('Upload should have error from disconnect', async () => {
        wrapper.update();
        expect(socket.receive.mock.calls.length).toEqual(1);
        expect(wrapper.state().isError).toEqual(true);
    });

});