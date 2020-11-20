import React from 'react';
import SmilesEntryPanel from '../SmilesEntryPanel'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Typography } from '@material-ui/core';


import './style.css';

const FindCellQuery = (props: any) => {

  return (
    <div className='container'>
      <div className='left-components'>
        <SmilesEntryPanel genes={""} {...props} />
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

export default FindCellQuery