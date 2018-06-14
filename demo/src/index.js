import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import './index.css';
import Upload from './upload';
import UploadList, { LinkList } from './uploadlist';
import ProfileForm from './profile-form';

function MyApp(props) {
	return (
		<Provider store={ store }>
			<div>
				<h1>QR Upload Examples</h1>
				<h2>1:1 ratio, images only, single file: (redux form)</h2>
				<ProfileForm />
				<h2>Any ratio, any filetype, multiple files:</h2>
				<Upload ratio={0} filetype='all' multiple={true} uploadlist={UploadList} />
				<h2>6:9 ratio, images only, multiple files:</h2>
				<Upload ratio={6/9} filetype='image' multiple={true} uploadlist={LinkList} />
				<h2>Audio only, multiple files:</h2>
				<Upload ratio={0} filetype='audio' multiple={true} uploadlist={UploadList} />
			</div>
		</Provider>
	);
}

ReactDOM.render(<MyApp />, document.getElementById('root'));
