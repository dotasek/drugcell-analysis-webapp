import React, { useState } from 'react';

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }),
)

const GeneEntryPanel = (props : any) => {
    const {genes, buttonText='Re-Run DrugCell'} = props;

    const [geneInput, setGeneInput] = useState<string | undefined>(genes);

    const classes = useStyles();

    const history = useHistory();

    const handleUpdate = (event : any) => {
        setGeneInput(event.target.value);
    }

    const handleClick = () => {
      history.push("/finddrugs/results/" + geneInput);
    }

    return ( 
    <div className={classes.container}>
    <TextField
        id='standard-multiline-static'
        label="Gene List"
        multiline
        rows={4}
        value={geneInput}
        onChange={handleUpdate}    
    />
       <Button variant="contained" color="primary" onClick={handleClick}>
            { buttonText }
        </Button>
    </div>
    )
}
  
export default GeneEntryPanel;