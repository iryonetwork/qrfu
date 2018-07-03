import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import linkImage from './assets/link.png';
import errorImage from './assets/error.png';

let connectionStyle = {textAlign: 'center', width: '128px', height: '118px', padding: '20px 10px 10px 10px'};

export default function UploadDisplay(props) {
	const isLoaded = props.uid !== '';

	if (props.isError) {
		return (
			<div className='qr-container'>
				<div className='qr-connection' style={connectionStyle}>
					<img src={errorImage} alt='error' />
					<p>Disconnected</p>
				</div>
			</div>
		);
	} else {
		return (
			<div className='qr-container'>
				{isLoaded && !props.connection && 
					<QRCode style={{padding: '10px'}} value={`http://${props.url}/ui/${props.uid}`} />
				}
				{isLoaded && props.connection && 
					<div className='qr-connection' style={connectionStyle}>
						<img src={linkImage} alt='success' />
						<p>Connected</p>
					</div>
				}
				<props.uploadlist uploads={props.uploads} delete={props.delete} />
			</div>
		);
	}
}

UploadDisplay.propTypes = {
    url: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
	uploadlist: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
	uploads: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            uid: PropTypes.string,
            type: PropTypes.string,
        })
    ).isRequired,
    delete: PropTypes.func,
	isError: PropTypes.bool.isRequired,
	connection: PropTypes.bool,
};