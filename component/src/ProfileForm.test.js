import React from 'react';
import enzyme, { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';
import ProfileForm from './ProfileForm';

enzyme.configure({ adapter: new Adapter() });

jest.mock('./lib/Upload', () => () => <div id="upload"></div>);

let wrapper;

beforeEach(() => {
    const mockStore = configureStore();
    let store = mockStore({});

    wrapper = mount(
        <Provider store={store}><ProfileForm /></Provider>,
    );
});

test('Form loads', () => {
    expect(wrapper.find('input').length).toEqual(1);
});