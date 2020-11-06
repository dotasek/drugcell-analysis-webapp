import React from 'react';

import TextField from '@material-ui/core/TextField'

const GeneEntryPanel = (props : any) => {
    return ( <TextField
        id='standard-multiline-static'
        label="Paste Gene List"
        multiline
        rows={4}
        defaultValue="" />
    )
}
  
export default GeneEntryPanel;