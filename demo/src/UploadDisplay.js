import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

export default class UploadDisplay extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isError: false
        };
	}

	render() {
		const isLoaded = this.props.uid !== '';

		if (this.state.isError) {
			return (
				<div className='code'>
					Error. Please reload the page.
				</div>
			);
		} else {
			return (
				<div className='code'>
					{isLoaded && 
						<QRCode value={`http://${this.props.url}/ui/${this.props.uid}`} />
					}
					<this.props.uploadlist uploads={this.props.uploads} />
				</div>
			);
		}
	}

	componentDidCatch(error, info) {
		this.setState({isError: true});
	}
}

UploadDisplay.propTypes = {
    url: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    uploadlist: PropTypes.func.isRequired,
}