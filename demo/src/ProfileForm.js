import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Upload from './upload/Upload';
import { ProfileImage } from './UploadList';
import Socket from './upload/Socket';

// redux-form example
class ProfileForm extends React.Component {
	constructor(props) {
		super(props);
		this.handleUpload = this.handleUpload.bind(this);
	}

	handleUpload(files) {
		if (files.length > 0) {
			this.props.change('avatar', files[0].url);
		}
	}

	render() {
		const { handleSubmit } = this.props;
		const socket = new Socket();

		return (
			<form onSubmit={handleSubmit}>
				<label>Username:</label>
				<Field name='username' component='input' type="text" />
				<label>Password:</label>
				<Field name='password' component='input' type='password' />
				<label>Profile Image:</label>
				<p>Scan the QR code to upload a profile picture.</p>
				<Upload ratio={1} filetype='image' multiple={false} uploadlist={ProfileImage} socket={socket} onChange={this.handleUpload} />
				<Field name='avatar' component='input' type='hidden' />
				<button type='submit'>Register</button>
			</form>
		);
	}
}

ProfileForm = reduxForm({
	form: 'profile',
}) (ProfileForm);

export default ProfileForm;