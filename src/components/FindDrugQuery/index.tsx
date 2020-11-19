import React from 'react';
import GeneEntryPanel from '../GeneEntryPanel'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Typography } from '@material-ui/core';


import './style.css';

const FindDrugQuery = (props: any) => {

  return (
    <div className='container'>
      <div className='left-components'>
        <GeneEntryPanel genes={""} {...props} />
      </div>
      <div className='center-components'>
        <div className='hint'>
          <ArrowBackIcon></ArrowBackIcon>
          <Typography>Enter Query Genes and then Click 'RUN DRUGCELL' to begin analysis.</Typography>
        </div>
      </div>
    </div>
  );
}

export default FindDrugQuery