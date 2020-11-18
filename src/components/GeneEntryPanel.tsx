import React, { useState, useContext} from 'react';

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import AppContext from '../context/AppContext'

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

const GeneEntryPanel = (props: any) => {
  const { genes, buttonText = 'Run DrugCell' } = props;

  const [geneInput, setGeneInput] = useState<string | undefined>(genes);

  const { cdapsServer } = useContext(AppContext);

  const classes = useStyles();

  const history = useHistory();

  const handleUpdate = (event: any) => {
    setGeneInput(event.target.value);
  }

  const handleClick = () => {
    console.log('sending gene input: ', geneInput);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "algorithm": "drugcellfinddrug",
        "data": geneInput
      })
    };
    fetch(cdapsServer + 'v1', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('response', data)
        history.push("/analyze/finddrugs/results/" + data.id)
      }
    );

  }

  return (
    <div className={classes.container}>
      <TextField
        id='standard-multiline-static'
        label="Query Genes"
        multiline
        rows={10}
        value={geneInput}
        placeholder="Enter a list of comma delimited genes"
        onChange={handleUpdate}
      />
      <Button variant="contained" color="primary" onClick={handleClick}>
        {buttonText}
      </Button>
    </div>
  )
}

export default GeneEntryPanel;