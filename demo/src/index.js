import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Upload from './upload';
import UploadList from './uploadlist';

ReactDOM.render(<Upload ratio={1} filetype="audio" multiple={true} uploadlist={UploadList} />, document.getElementById('root'));
