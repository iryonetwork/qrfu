import { createStore, applyMiddleware } from 'redux';
import { combineForms } from 'react-redux-form';

const initialUser = {
    name: '',
    password: '',
    avatar: '',
};

const store = createStore(combineForms({
    user: initialUser,
}));

export default store;