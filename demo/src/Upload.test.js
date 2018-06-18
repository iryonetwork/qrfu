import React from 'react';
import enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import QRCode from 'qrcode.react';
import Upload from './Upload';
import UploadList from './UploadList';
import Socket from './Socket';

enzyme.configure({ adapter: new Adapter() });

let wrapper;

beforeEach(() => {
    jest.mock('./UploadList', () => () => <ul id="uploadlist"></ul>);
    jest.mock('qrcode.react', () => () => <div id="qr"></div>);
    
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