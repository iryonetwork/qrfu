import React from 'react';
import io from 'socket.io-client';
var QRCode = require('qrcode.react');

const socket = io();

/**
 * Props of Upload component:
 *   - ratio can be any number, if it is 0 then the app will allow any ratio
 * 
 *   - filetype can be image, audio, or all
 * 
 *   - multiple is a boolean, if true the user can upload as many files as they want,
 *     if false each upload will overwrite any previous files
 * 
 *   - uploadList is a component for displaying files - it needs to accept an uploads prop
 *     that is a list of objects with name and type properties
 */
export default class Upload extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			url: "",
			uid: "",
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
		const self = this;
		
		socket.on('connect', function(data) {
			socket.emit('join', self.state.uid, self.props.ratio, self.props.filetype, self.props.multiple);
		});
		
		socket.on('messages', function(upload) {
            const uploads = self.state.uploads.slice();
            
            if (!self.props.multiple) {
                // only most recent upload exists
                self.setState({uploads: [upload]});
			} else if (!uploads.find(item => item.name === upload.name)) {
				uploads.push(upload);
				self.setState({uploads: uploads});
			}
		});
		
		socket.emit('join', self.state.uid, self.props.ratio, self.props.filetype, self.props.multiple);
	}

	render() {
		const isLoaded = this.state.uid !== "";

		if (this.state.isError) {
			return (
				<div className="code">
					Error. Please reload the page.
				</div>
			);
		} else {
			return (
				<div className="code">
					{isLoaded && 
						<QRCode value={`http://${this.state.url}/ui/${this.state.uid}`} />
					}
					<this.props.uploadlist uploads={this.state.uploads} />
				</div>
			);
		}
	}

	componentWillUnmount() {
		socket.disconnect();
	}

	componentDidCatch(error, info) {
		this.setState({isError: true});
	}
}