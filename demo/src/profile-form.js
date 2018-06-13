import React from 'react';
import { Control, Form, actions } from 'react-redux-form';
import store from './store.js';
import Upload from './upload';
import { ProfileImage } from './uploadlist';

// react-redux-form example
export default class ProfileForm extends React.Component {
	constructor(props) {
		super(props);
		this.handleUpload = this.handleUpload.bind(this);
	}

	handleSubmit(user) {
		console.log(user);
	}

	handleUpload(files) {
		store.dispatch(actions.change('user.avatar', files[0].url));
	}

	render() {
		return (
			<Form
				model='user'
				onSubmit={(user) => this.handleSubmit(user)}
			>
				<label>Username:</label>
				<Control.text model='user.name' id='user'/>
				<label>Password:</label>
				<Control.text type='password' model='user.password' />
				<label>Profile Image:</label>
				<p>Scan the QR code to upload a profile picture.</p>
				<Upload ratio={1} filetype='image' multiple={false} uploadlist={ProfileImage} onUpload={this.handleUpload} />
				<button type='submit'>Register</button>
			</Form>
		);
	}
}