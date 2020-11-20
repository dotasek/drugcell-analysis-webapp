import React, {useState, useContext} from 'react';
import {useLocation} from 'react-router-dom'
import CellAnalysisPanel from '../CellAnalysisPanel'
import SmilesEntryPanel from '../SmilesEntryPanel'
import { useParams } from 'react-router-dom'
import useDrugs from '../../hooks/useDrugs'
import { Typography } from '@material-ui/core';
import AppContext from '../../context/AppContext';
import { CircularProgress } from '@material-ui/core';

import './style.css';

interface FindDrugParamTypes {
  resultid: string
}

const FindCell = (props : any) => {
  
  const params = useParams<FindDrugParamTypes>();

  const { resultid } = params;

  const location = useLocation();

  const { cdapsServer } = useContext(AppContext)

  const drugResponse = useDrugs(cdapsServer, resultid);

  if (drugResponse.isError) {

  }

  if (drugResponse.isLoading) {
    return (
      <div className='spinner'>
        <CircularProgress color="secondary" />
        <Typography>Running DrugCell Analysis...</Typography>
      </div>
    )
  }

  if (!drugResponse.data) {
    return (
      <Typography>Waiting
      </Typography>
    )
  }

  return (
    <div className='container'>
      <div className='left-components'>
        <SmilesEntryPanel smiles={drugResponse.data.inputGenes} {...props} />
      </div>
      <div className='center-components'>
        <CellAnalysisPanel data={drugResponse.data} {...props}/>
      </div>
    </div>
  );
}

export default FindCell;