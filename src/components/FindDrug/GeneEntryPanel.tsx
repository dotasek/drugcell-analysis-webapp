import React from 'react';

import TextField from '@material-ui/core/TextField'

const GeneEntryPanel = (props : any) => {
    const {genes} = props;

    return ( <TextField
        id='standard-multiline-static'
        label="Paste Gene List"
        multiline
        rows={4}
        defaultValue={genes ? genes : ""} />
    )
}
  
export default GeneEntryPanel;