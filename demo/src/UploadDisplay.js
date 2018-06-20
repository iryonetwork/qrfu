import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

export default function UploadDisplay(props) {
	const isLoaded = props.uid !== '';

	if (props.isError) {
		return (
			<div className='code'>
				Error. Please reload the page.
			</div>
		);
	} else {
		return (
			<div className='code'>
				{isLoaded && 
					<QRCode value={`http://${props.url}/ui/${props.uid}`} />
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