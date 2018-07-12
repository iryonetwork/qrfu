import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import './index.css';
import Upload from './lib';
import UploadList, { LinkList } from './UploadList';
import ProfileForm from './ProfileForm';

function MyApp(props) {
	const submit = values => {
		window.alert (JSON.stringify (values));
	};

	return (
		<Provider store={ store }>
			<div>
				<img src="/iryoqrlogo.png" className="logo" alt="iryo qr logo" />
				
				<div className="example">
					<h2>Example 1</h2>
					<table>
						<tbody>
							<tr>
								<td>Ratio:</td>
								<td><b>1:1</b></td>
							</tr>
							<tr>
								<td>Filetype:</td>
								<td><b>images</b></td>
							</tr>
							<tr>
								<td>Quantity</td>
								<td><b>single</b></td>
							</tr>
						</tbody>
					</table>
					<p>Scan the QR code to upload a profile image.</p>
					<p>Uploaded documents:</p>
					<ProfileForm onSubmit={submit}/>
				</div>
				
				<div className="example">
					<h2>Example 2</h2>
					<table>
						<tbody>
							<tr>
								<td>Ratio:</td>
								<td><b>any</b></td>
							</tr>
							<tr>
								<td>Filetype:</td>
								<td><b>any</b></td>
							</tr>
							<tr>
								<td>Quantity</td>
								<td><b>multiple</b></td>
							</tr>
						</tbody>
					</table>
					<p>Scan the QR code to upload a file.</p>
					<p>Uploaded documents:</p>
					<Upload ratio={0} filetype='all' multiple={true} uploadlist={UploadList} />
				</div>
				
				<div className="example">
					<h2>Example 3</h2>
					<table>
						<tbody>
							<tr>
								<td>Ratio:</td>
								<td><b>6:9</b></td>
							</tr>
							<tr>
								<td>Filetype:</td>
								<td><b>images</b></td>
							</tr>
							<tr>
								<td>Quantity</td>
								<td><b>multiple</b></td>
							</tr>
						</tbody>
					</table>
					<p>Scan the QR code to upload a file.</p>
					<p>Uploaded documents:</p>
					<Upload ratio={6/9} filetype='image' multiple={true} uploadlist={LinkList} />
				</div>
				
				<div className="example">
					<h2>Example 4</h2>
					<table>
						<tbody>
							<tr>
								<td>Ratio:</td>
								<td><b>n/a</b></td>
							</tr>
							<tr>
								<td>Filetype:</td>
								<td><b>audio</b></td>
							</tr>
							<tr>
								<td>Quantity</td>
								<td><b>multiple</b></td>
							</tr>
						</tbody>
					</table>
					<p>Scan the QR code to upload a file.</p>
					<p>Uploaded documents:</p>
					<Upload ratio={0} filetype='audio' multiple={true} uploadlist={UploadList} /> 
				</div>
			</div>
		</Provider>
	);
}

ReactDOM.render(<MyApp />, document.getElementById('root'));
