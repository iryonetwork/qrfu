import React from 'react';

export default function UploadList(props) {
    const items = props.uploads.map(file => {
        if (file.type === "audio") {
            return (<li key={file.name}>
                        <audio src={`http://localhost:3001/api/file/${file.name}`} controls></audio>
                        <div>{file.name}</div>
                    </li>);
        } else {
            return (<li key={file.name}>
                        <a href={`http://localhost:3001/api/file/${file.name}`}>
                            <img src={`http://localhost:3001/api/file/${file.name}`} alt="preview"/>
                            <div>{file.name}</div>
                        </a>
                    </li>);
        }
    });
    
	return (
		<ul>{items}</ul>
	);
}