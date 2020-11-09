import React, {useState, useEffect} from 'react';

import {useLocation} from 'react-router-dom'

import AnalysisPanel from '../AnalysisPanel'

import GeneEntryPanel from './GeneEntryPanel'

import './style.css';

const FindDrug = (props : any) => {
  const [genes, setGenes] = useState<string | undefined>();
  
  const location = useLocation();

  useEffect(()=>{
    if (location.search.startsWith('?')) {
      const genes = location.search.substring(location.search.indexOf('=') + 1, location.search.length);
      console.log('useEffect genes detected: ', genes)
      setGenes(decodeURIComponent(genes));
    }
  }, [location])

  return (
    <div className='container'>
      <div className='left-components'>
        <GeneEntryPanel genes={genes} setGenes={setGenes} {...props} />
      </div>
      <div className='center-components'>
       <AnalysisPanel genes={genes} {...props}/>
      </div>
    </div>
  );
}

export default FindDrug;