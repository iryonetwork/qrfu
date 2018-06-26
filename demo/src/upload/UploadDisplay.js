import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

export default function UploadDisplay(props) {
	const isLoaded = props.uid !== '';

	if (props.isError) {
		return (
			<div className='code'>
				<div className="connected">
					<img src="/error.png" alt="error" />
					<p>Disconnected</p>
				</div>
			</div>
		);
	} else {
		return (
			<div className='code'>
				{isLoaded && !props.connection && 
					<QRCode value={`http://${props.url}/ui/${props.uid}`} />
				}
				{isLoaded && props.connection && 
					<div className="connected">
						<img src="/success.png" alt="success" />
						<p>Connected</p>
					</div>
				}
				<props.uploadlist uploads={props.uploads} />
			</div>
		);
	}
}

UploadDisplay.propTypes = {
    url: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    uploadlist: PropTypes.func.isRequired,
    isError: PropTypes.bool.isRequired,
};