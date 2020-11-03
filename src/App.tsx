import React from 'react';

import { Switch, Route, BrowserRouter } from 'react-router-dom'

import './App.css';

import AnalysisPanel from './components/AnalysisPanel'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/results/:resultid">
          <AnalysisPanel />
        </Route>
        <Route path="/genesubmission">
          SUBMIT
        </Route>
        <Route path="/">
          meh
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
