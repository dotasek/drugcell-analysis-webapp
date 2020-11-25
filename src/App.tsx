import React from 'react';

import { Switch, Route, BrowserRouter } from 'react-router-dom'

import './App.css';

import AppContext from './context/AppContext'
import FindDrug from './components/FindDrug'
import FindDrugQuery from './components/FindDrugQuery'

import FindCell from './components/FindCell'
import FindCellQuery from './components/FindCellQuery'

import AppShell from './components/AppShell'
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
          There is nothing here.
        </Route>
      </Switch>
    </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
