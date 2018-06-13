import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store.js';
import './index.css';
import Upload from './upload';
import UploadList from './uploadlist';
import ProfileForm from './profile-form';

function MyApp(props) {
	return (
		<Provider store={ store }>
			<div>
				<ProfileForm />
				<Upload ratio={1} filetype='image' multiple={true} uploadlist={UploadList} />
			</div>
		</Provider>
	);
}

ReactDOM.render(<MyApp />, document.getElementById('root'));
