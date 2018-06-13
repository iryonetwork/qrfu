import React from 'react';
import renderer from 'react-test-renderer';
import { combineForms } from 'react-redux-form';
import enzyme, { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';
import ProfileForm from './profile-form';

enzyme.configure({ adapter: new Adapter() });

let wrapper;

beforeEach(() => {
    const files = [
        {
            name: 'file-img',
            url: 'http://localhost:3001/',
            uid: '10001010100110',
            type: 'image',
        },
        {
            name: 'file-audio',
            url: 'http://localhost:3001/',
            uid: '00011010100110',
            type: 'audio',
        }
    ];
    const initialState = {
        name: 'fred',
        password: '',
        avatar: '',
    };
    const mockStore = configureStore();
    let store = mockStore(initialState);

    wrapper = shallow(
        <Provider store={store}><ProfileForm /></Provider>,
    ).dive();
});

test('Form displays initial data', () => {
    expect(wrapper.find('#user').getElement().value).toBe('fred')
});