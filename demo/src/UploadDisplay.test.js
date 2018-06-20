import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import UploadDisplay from './UploadDisplay';
import UploadList from './UploadList';

test('UploadDisplay loads with QR code', () => {
    const url = '127.0.0.1:3000/ui/123';
    const uid = '123';

    const component = renderer.create(
        <UploadDisplay
				uid={uid}
				url={url}
				uploadlist={UploadList}
				uploads={[]}
                isError={false} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('UploadDisplay loads without QR code', () => {
    const url = '';
    const uid = '';

    const component = renderer.create(
        <UploadDisplay
				uid={uid}
				url={url}
				uploadlist={UploadList}
				uploads={[]} 
                isError={false} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('UploadDisplay loads with error', () => {
    const url = '';
    const uid = '';

    const component = renderer.create(
        <UploadDisplay
				uid={uid}
				url={url}
				uploadlist={UploadList}
				uploads={[]} 
                isError={true} />
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});