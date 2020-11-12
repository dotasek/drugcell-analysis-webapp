import React from 'react';

import { Switch, Route, BrowserRouter } from 'react-router-dom'

import './App.css';

import FindDrug from './components/FindDrug'

import AppShell from './components/AppShell'

function App() {
  return (
    <BrowserRouter>
      <Switch>
      <Route path="/finddrugs/results/:resultid">
          <AppShell title={ "DrugCell Find Drugs" } tooltip={"Analyze Genetype With DrugCell"}>
            <FindDrug/>
          </AppShell>
        </Route>
        <Route path="/finddrugs/">
          query
        </Route>
        <Route path="/">
          meh
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
