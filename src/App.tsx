import React from 'react';

import { Switch, Route, BrowserRouter } from 'react-router-dom'

import './App.css';

import FindDrug from './components/FindDrug'

import AppShell from './components/AppShell'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/results/:resultid">
          <AppShell title={ "DrugCell Prophet" } tooltip={"Analyze Genetype With DrugCell"}>
            <FindDrug/>
          </AppShell>
        </Route>
        <Route path="/">
          meh
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
