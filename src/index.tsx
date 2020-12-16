import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import AppConfig from './model/AppConfig'
import reportWebVitals from './reportWebVitals';

async function loadResource(resourceURL : string) {
  const response = await fetch(resourceURL);

  if (response.status !== 200) {
    throw new Error('Failed to load resource file:' + resourceURL);
  }
  const resource = await response.json();
  return resource;
}

async function loadApp() {
 
  const resourceURL = `${process.env.PUBLIC_URL}/resource.json`;
  const resource : any = await loadResource(resourceURL);

  console.log('* Resource file loaded:', resourceURL);

  const drugIndexURL = `${process.env.PUBLIC_URL}/drug-index.json`;
  const drugIndex : any = await loadResource(drugIndexURL);

  console.log('* Drug index loaded:', drugIndexURL);

  const cdapsServer = resource['cdapsServer'];

  const config: AppConfig = {
    cdapsServer: cdapsServer,
    drugIndex: drugIndex
  };

  ReactDOM.render(
    <React.StrictMode>
      <App config={config} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

loadApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
