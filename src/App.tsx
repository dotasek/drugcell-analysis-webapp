import React from 'react';

import { Switch, Route, BrowserRouter } from 'react-router-dom'

import './App.css';

import AppContext from './context/AppContext'
import FindDrug from './components/FindDrug'
import AppShell from './components/AppShell'
import FindDrugQuery from './components/FindDrugQuery'

import AppConfig from './model/AppConfig';


type AppProps = {
  config : AppConfig
}

const App = (props : AppProps) => {

  const { config } = props;

  return (
    <AppContext.Provider value={ config }>
    <BrowserRouter>
      <Switch>
        <Route path="/analyze/finddrugs/results/:resultid">
          <AppShell title={ "DrugCell Find Drugs" } tooltip={"Analyze Genetype With DrugCell"}>
            <FindDrug/>
          </AppShell>
        </Route>
        <Route path="/analyze/finddrugs/">
        <AppShell title={ "DrugCell Find Drugs" } tooltip={"Analyze Genetype With DrugCell"}>
          <FindDrugQuery />
          </AppShell>
        </Route>
        <Route path="/">
          meh
        </Route>
      </Switch>
    </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
