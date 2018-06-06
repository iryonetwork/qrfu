import React from 'react';

export default function UploadList(props) {
	const uploads = props.uploads;
    
    const items = uploads.map(file =>
		<li key={file.name}>
			<a href={`http://localhost:3001/api/file/${file.name}`}>
				<img src={`http://localhost:3001/api/file/${file.name}`} alt="preview"/>
				<div>{file.name}</div>
			</a>
		</li>
    );
    
	return (
		<ul>{items}</ul>
	);
}