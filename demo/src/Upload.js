import React from 'react';
import PropTypes from 'prop-types';
import UploadDisplay from './UploadDisplay';

/**
 * Props of Upload component:
 *   - ratio can be any number, if it is 0 then the app will allow any ratio (only applies to images)
 * 
 *   - filetype can be image, audio, or all
 * 
 *   - multiple is a boolean, if true the user can upload as many files as they want,
 *     if false each upload will overwrite any previous files
 * 
 *   - uploadList is a component for displaying files - it needs to accept an uploads prop
 *     that is a list of objects with name, url, and type properties
 * 
 *   - socket is an object with the correct methods to access the server websocket
 *   
 *   - onUpload is a callback that is sent the uploads list every time the list changes
 */
export default class Upload extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			url: '',
			uid: '',
			uploads: [],
			isError: false,
        };

		fetch('/api/fetch')
			.then(results => results.json())
			.then(data => {
				this.setState({url: data.url});
				this.setState({uid: data.uid});
				this.connect();
			});
	}

	connect() {
		this.props.socket.join(
			this.state.uid,
			this.props.ratio,
			this.props.filetype,
			this.props.multiple,
			this.onDisconnect.bind(this),
			this.onReconnect.bind(this)
		);
		this.props.socket.receive(this.onUpload.bind(this));
	}
	
	onUpload(upload) {
		if (upload.uid !== this.state.uid) {
			return;
		}

		if (this.props.filetype !== 'all') {
			if (upload.type !== this.props.filetype) {
				return;
			}
		}

		const uploads = this.state.uploads.slice();
		
		if (!this.props.multiple) {
			// only most recent upload exists
			this.setState({uploads: [upload]});
		} else if (uploads.find(item => item.name === upload.name)) {
			const fUploads = uploads.filter(item => item.name !== upload.name);
			fUploads.push(upload);
			this.setState({uploads: fUploads});
		} else {
			uploads.push(upload);
			this.setState({uploads: uploads});
		}
	}

	onDisconnect() {
		this.setState({isError: true});
	}

	onReconnect() {
		this.setState({isError: false});
	}

	render() {
		return (
			<UploadDisplay
				uid={this.state.uid}
				url={this.state.url}
				uploadlist={this.props.uploadlist}
				uploads={this.state.uploads}
				isError={this.state.isError} />
		)
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.onUpload) {
			this.props.onUpload(this.state.uploads);
		}
	}

	componentWillUnmount() {
		this.props.socket.disconnect();
	}

	componentDidCatch(error, info) {
		this.setState({isError: true});
	}
}

Upload.propTypes = {
    ratio: PropTypes.number,
    filetype: PropTypes.string.isRequired,
    multiple: PropTypes.bool.isRequired,
    uploadlist: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
    onUpload: PropTypes.func,
}