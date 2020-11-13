import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import AppConfig from './model/AppConfig'
import reportWebVitals from './reportWebVitals';

async function loadResource() {
  const response = await fetch(`${process.env.PUBLIC_URL}/resource.json`)

  if (response.status !== 200) {
    throw new Error('Failed to load resource file.  Could not find NDEx server location')
  }
  const resource = await response.json()
  console.log('* Resource file loaded:', resource)
  const cdapsServer = resource['cdapsServer']
 
  const config: AppConfig = {
   cdapsServer : cdapsServer
  }

  ReactDOM.render(
  <React.StrictMode>
    <App config={config}/>
  </React.StrictMode>,
  document.getElementById('root')
);
  }
  loadResource();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
