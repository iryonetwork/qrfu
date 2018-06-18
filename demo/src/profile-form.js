import React from 'react';
import {Field, reduxForm} from 'redux-form';
import Upload from './upload';
import { ProfileImage } from './uploadlist';

// redux-form example
class ProfileForm extends React.Component {
	constructor(props) {
		super(props);
		this.handleUpload = this.handleUpload.bind(this);
	}

	handleUpload(files) {
		this.props.change('avatar', files[0].url);
	}

	render() {
		const {handleSubmit} = this.props;
		return (
			<form onSubmit={handleSubmit}>
				<label>Username:</label>
				<Field name='username' component='input' type="text" />
				<label>Password:</label>
				<Field name='password' component='input' type='password' />
				<label>Profile Image:</label>
				<p>Scan the QR code to upload a profile picture.</p>
				<Upload ratio={1} filetype='image' multiple={false} uploadlist={ProfileImage} onUpload={this.handleUpload} />
				<Field name='avatar' component='input' type='text' />
				<button type='submit'>Register</button>
			</form>
		);
	}
}

ProfileForm = reduxForm({
	form: 'profile',
}) (ProfileForm);

export default ProfileForm;