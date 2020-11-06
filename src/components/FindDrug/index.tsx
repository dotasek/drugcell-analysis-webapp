import React, {useState} from 'react';

import {useLocation} from 'react-router-dom'

import AnalysisPanel from '../AnalysisPanel'

import GeneEntryPanel from './GeneEntryPanel'

import './style.css';

const FindDrug = (props : any) => {
  const [genes, setGenes] = useState<string | undefined>();
  
  const location = useLocation();

  console.log('location location location: ', location)

  return (
    <div className='container'>
      <div className='left-components'>
        <GeneEntryPanel genes={genes} setGenes={setGenes} {...props} />
      </div>
      <div className='center-components'>
       <AnalysisPanel  {...props}/>
      </div>
    </div>
  );
}

export default FindDrug;