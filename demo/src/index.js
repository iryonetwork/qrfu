import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Control, Form, actions } from 'react-redux-form';
import store from './store.js';
import './index.css';
import Upload from './upload';
import UploadList, { LinkList, ProfileImage } from './uploadlist';

function MyApp(props) {
	return (
		<Provider store={ store }>
			<div>
				<ProfileForm />
				<Upload ratio={1} filetype='image' multiple={true} uploadlist={UploadList} />
			</div>
		</Provider>
	);
}

// react-redux-form example
class ProfileForm extends React.Component {
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
				<Control.text model='user.name' />
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

ReactDOM.render(<MyApp />, document.getElementById('root'));
