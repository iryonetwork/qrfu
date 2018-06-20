import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

export default class UploadDisplay extends React.Component {
	render() {
		const isLoaded = this.props.uid !== '';

		if (this.props.isError) {
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
}

UploadDisplay.propTypes = {
    url: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    uploadlist: PropTypes.func.isRequired,
    isError: PropTypes.bool.isRequired,
}