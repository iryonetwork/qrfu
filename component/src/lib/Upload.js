import React from 'react';
import PropTypes from 'prop-types';
import UploadDisplay from './UploadDisplay';
import Socket from './Socket';
import dotenv from 'dotenv';
dotenv.load();

// qrfu-api server url
const url = process.env.REACT_APP_QR_URL || 'http://127.0.0.1:3001';

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
 *   - onChange is a callback that is sent the uploads list every time the list changes
 */
export default class Upload extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			uid: '',
			uploads: [],
			isError: false,
			mobileConnection: false,
        };

		this.delete = this.delete.bind(this);

		fetch(`${url}/api/fetch`)
			.then(results => results.json())
			.then(data => {
				this.setState({uid: data.uid});
				this.connect();
			})
			.catch(error => {
				this.setState({isError: true});
			});
	}

	connect() {
		this.props.socket.join(
			url,
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

		if (upload.connected) {
			this.setState({mobileConnection: true});
			return;
		}

		if (this.props.filetype !== 'all') {
			if (upload.type !== this.props.filetype) {
				return;
			}
		}

		upload.url = `${url}/api/file/${upload.name}`;

		const uploads = this.state.uploads.slice();
		
		if (!this.props.multiple) {
			// only most recent upload exists
			this.setState({uploads: [upload]});
			this.setState({mobileConnection: false});
		} else if (uploads.find(item => item.name === upload.name)) {
			const filterUploads = uploads.filter(item => item.name !== upload.name);
			filterUploads.push(upload);
			this.setState({uploads: filterUploads});
		} else {
			uploads.push(upload);
			this.setState({uploads: uploads});
		}
	}

	delete(fileName) {
		fetch(`${url}/api/file/${fileName}`, {method: 'DELETE'})
			.then(data => {
				if (data.status === 200) {
					this.setState({mobileConnection: false});

					const uploads = this.state.uploads.slice();
					this.setState({uploads: uploads.filter(item => item.name !== fileName)});
				} else {
					this.setState({isError: true});
				}
			})
			.catch(error => {
				this.setState({isError: true});
			});
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
				url={url}
				uploadlist={this.props.uploadlist}
				uploads={this.state.uploads}
				delete={this.delete}
				isError={this.state.isError}
				connection={this.state.mobileConnection} />
		)
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.onChange) {
			this.props.onChange(this.state.uploads);
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
    uploadlist: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    socket: PropTypes.object.isRequired,
    onChange: PropTypes.func,
}

Upload.defaultProps = {
	socket: new Socket(),
}