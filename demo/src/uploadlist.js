import React from 'react';
import PropTypes from 'prop-types';

// example components for displaying uploaded files

export default function UploadList(props) {
    const items = props.uploads.map(file => {
        if (file.type === "audio") {
            return (<li key={file.name}>
                        <audio src={`${file.url}`} controls></audio>
                        <div>{file.name}</div>
                    </li>);
        } else {
            return (<li key={file.name}>
                        <a href={`${file.url}`}>
                            <img src={`${file.url}`} alt="preview" />
                            <div>{file.name}</div>
                        </a>
                    </li>);
        }
    });
    
	return (
		<ul className="custom">{items}</ul>
	);
}

export function LinkList(props) {
    const items = props.uploads.map(file => 
        (<li>
            <a href={`${file.url}`}>
                {file.name}
            </a>
        </li>)
    );
    
	return (
		<ul>{items}</ul>
	);
}

export function ProfileImage(props) {
    if (props.uploads.length > 0) {
        return (
            <img className="profilePic" src={`${props.uploads[0].url}`} alt="avatar" />
        );
    } else {
        return (
            <div className="profilePic"></div>
        );
    }
}

UploadList.propTypes = LinkList.propTypes = ProfileImage.propTypes = {
    uploads: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
            uid: PropTypes.string,
            type: PropTypes.string,
        })
    ).isRequired
};