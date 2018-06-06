import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import io from 'socket.io-client';
import UploadList from './uploadlist.js';
var QRCode = require('qrcode.react');

const socket = io();

class Code extends React.Component {
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
			socket.emit('join', self.state.uid);
		});
		
		socket.on('messages', function(upload) {
			const uploads = self.state.uploads.slice();
			
			if (!uploads.find(item => item.name === upload.name)) {
				uploads.push(upload);
				self.setState({uploads: uploads});
			}
		});
		
		socket.emit('join', self.state.uid);
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
					<UploadList uploads={this.state.uploads} />
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

ReactDOM.render(<Code />, document.getElementById('root'));
