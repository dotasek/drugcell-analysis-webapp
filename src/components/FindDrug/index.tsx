import React, {useState, useContext} from 'react';
import {useLocation} from 'react-router-dom'
import DrugAnalysisPanel from '../DrugAnalysisPanel'
import GeneEntryPanel from '../GeneEntryPanel'
import { useParams } from 'react-router-dom'
import useDrugs from '../../hooks/useDrugs'
import { Button, Typography } from '@material-ui/core';
import AppContext from '../../context/AppContext';
import { CircularProgress } from '@material-ui/core';

import './style.css';

interface FindDrugParamTypes {
  resultid: string
}

const FindDrug = (props : any) => {
  
  const params = useParams<FindDrugParamTypes>();

  const { resultid } = params;

  const location = useLocation();

  const { cdapsServer } = useContext(AppContext)

  const drugResponse = useDrugs(cdapsServer, resultid);

  const reloadPage = () => {
    window.location.reload();
  }

  if (drugResponse.isError) {
    const errorString = new String(drugResponse.error);
    return (
      <div className='user-message'>
        <Typography variant='h6'>
          Error Loading Results
        </Typography>
        <Typography>
          Cause: { errorString }
        </Typography>
        <Button onClick={reloadPage} variant="contained" color='primary'>RETRY</Button>
      </div>
    )
  }

  if (drugResponse.isLoading) {
    return (
      <div className='user-message'>
        <Typography variant='h6'>Waiting for DrugCell Analysis...</Typography>
        <p><CircularProgress color="secondary" /></p>
        <Typography>
          Please be patient. This could take 30 seconds or more, depending on server load.
        </Typography>
      </div>
    )
  }

  if (!drugResponse.data) {
    return (
      <div className='user-message'>
        <Typography variant='h6'>
          The server took too long to respond.
        </Typography>
        <Typography>
          The server may be busy. You can click 'RETRY' to try accessing your results again.
        </Typography>
        <Button onClick={reloadPage} variant="contained" color='primary'>RETRY</Button>
      </div>
    )
  }

  return (
    <div className='container'>
      <div className='left-components'>
        <GeneEntryPanel genes={drugResponse.data.inputGenes } validGenes={drugResponse.data.validGenes} invalidGenes={drugResponse.data.invalidGenes} {...props} />
      </div>
      <div className='center-components'>
        <DrugAnalysisPanel data={drugResponse.data} {...props}/>
      </div>
    </div>
  );
}

export default FindDrug;