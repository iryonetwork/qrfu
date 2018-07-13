import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Upload from './lib/Upload';
import { ProfileImage } from './UploadList';

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

		return (
			<form onSubmit={handleSubmit}>
				<Upload ratio={1} filetype='image' multiple={false} uploadlist={ProfileImage} onChange={this.handleUpload}>
					<div>
						<Field name='username' component='input' type="text" placeholder="username" />
						<Field name='password' component='input' type='password' placeholder="password" />
						<button type='submit'>Register</button>
					</div>
				</Upload>

				<Field name='avatar' component='input' type='hidden' />
			</form>
		);
	}
}

ProfileForm = reduxForm({
	form: 'profile',
}) (ProfileForm);

export default ProfileForm;