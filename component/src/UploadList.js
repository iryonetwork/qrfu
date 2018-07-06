import React from 'react';
import PropTypes from 'prop-types';

// example components for displaying uploaded files

export default function UploadList(props) {
    const items = props.uploads.map(file => {
        if (file.type === 'audio') {
            return (<li key={file.name}>
                        <audio src={`${file.url}`} controls></audio>
                        <div>{file.name}</div>

                        {props.delete &&
                            <button type="button" onClick={() => props.delete(file.name)}>Delete</button>
                        }
                    </li>);
        } else {
            return (<li key={file.name}>
                        <a href={`${file.url}`}>
                            <img src={`${file.url}`} alt='preview' />
                            <div>{file.name}</div>
                        </a>

                        {props.delete && 
                            <button type="button" onClick={() => props.delete(file.name)}>Delete</button>
                        }
                    </li>);
        }
    });
    
    if (props.uploads.length > 1 && props.delete) {
        return (
            <div>
                <button type="button" onClick={() => {props.uploads.forEach(f => props.delete(f.name))}}>
                    Delete All
                </button>

                <ul className='custom'>{items}</ul>
            </div>
        );
    } else {
        return (
            <ul className='custom'>{items}</ul>
        );
    }
}

export function LinkList(props) {
    const items = props.uploads.map(file => 
        (<li key={file.name}>
            <a href={`${file.url}`}>
                {file.name}
            </a>
            {props.delete &&
                <button type="button" onClick={() => props.delete(file.name)}>Delete</button>
            }
        </li>)
    );
    
    if (props.uploads.length > 1 && props.delete) {
        return (
            <div>
                <button type="button" onClick={() => {props.uploads.forEach(f => props.delete(f.name))}}>
                    Delete All
                </button>

                <ul>{items}</ul>
            </div>
        );
    } else {
        return (
            <ul>{items}</ul>
        );
    }
}

export function ProfileImage(props) {
    if (props.uploads.length > 0) {
        return (
            <span>
                <img className='profilePic' src={`${props.uploads[0].url}`} alt='avatar' />

                {props.delete && 
                    <button type="button" onClick={() => props.delete(props.uploads[0].name)}>Delete</button>
                }
            </span>
        );
    } else {
        return (
            <div className='profilePic'></div>
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
    ).isRequired,
    delete: PropTypes.func,
};