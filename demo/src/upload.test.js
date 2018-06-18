import React from 'react';
import { WebSocket, Server, SocketIO } from 'mock-socket';
import enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import QRCode from 'qrcode.react';
import Upload from './upload';
import UploadList from './uploadlist';

enzyme.configure({ adapter: new Adapter() });

jest.mock('./uploadlist', () => () => <ul id="uploadlist"></ul>);
jest.mock('qrcode.react', () => () => <div id="qr"></div>);

let wrapper;

const mockServer = new Server('http://localhost:3001');

beforeEach(() => {
    window.io = SocketIO;

    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({json: function() {return {url: '127.0.0.1:3000/ui/123', uid: '123'}}}));

    wrapper = mount(
        <Upload ratio={0} filetype='image' multiple={true} uploadlist={UploadList} />
    );
});

test('Upload should load correctly', () => {
    expect(wrapper.find('.code').length).toEqual(1);
    expect(wrapper.find('#uploadlist').length).toEqual(1);
    expect(wrapper.find('#qr').length).toEqual(0);
    expect(wrapper.props().ratio).toEqual(0);
    expect(wrapper.props().filetype).toBe('image');
    expect(wrapper.props().multiple).toEqual(true);
});

test('Upload should load qr after fetch', async () => {
    wrapper.update();
    expect(wrapper.find('#qr').length).toEqual(1);
});