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
                            <button className="qr-delete" type="button" onClick={() => props.delete(file.name)}><img src="/delete.png" alt="delete file"/></button>
                        }
                    </li>);
        } else {
            return (<li key={file.name}>
                        <a href={`${file.url}`}>
                            <img src={`${file.url}`} alt='preview' />
                            <div>{file.name}</div>
                        </a>

                        {props.delete && 
                            <button className="qr-delete" type="button" onClick={() => props.delete(file.name)}><img src="/delete.png" alt="delete file"/></button>
                        }
                    </li>);
        }
    });
    
    if (props.uploads.length > 1 && props.delete) {
        return (
            <div>
                <button className="qr-delete-all" type="button" onClick={() => {props.uploads.forEach(f => props.delete(f.name))}}>
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
                <button className="qr-delete" type="button" onClick={() => props.delete(file.name)}><img src="/delete.png" alt="delete file"/></button>
            }
        </li>)
    );
    
    if (props.uploads.length > 1 && props.delete) {
        return (
            <div>
                <button className="qr-delete-all" type="button" onClick={() => {props.uploads.forEach(f => props.delete(f.name))}}>
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
        let file = props.uploads[props.uploads.length - 1];

        return (
            <ul className='custom'>
                <li key={file.name}>
                    <a href={`${file.url}`}>
                        <img src={`${file.url}`} alt='preview' />
                        <div>{file.name}</div>
                    </a>

                    {props.delete && 
                        <button className="qr-delete" type="button" onClick={() => props.delete(file.name)}><img src="/delete.png" alt="delete file"/></button>
                    }
                </li>
            </ul>
        );
    } else {
        return (
            <ul className='custom'></ul>
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