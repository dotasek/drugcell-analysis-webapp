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

const SmilesEntryPanel = (props: any) => {
  const { smiles } = props;

  const [smilesInput, setSmilesInput] = useState<string | undefined>(smiles);

  const [email, setEmail] = useState<string>();

  const { cdapsServer } = useContext(AppContext);

  const classes = useStyles();

  const history = useHistory();

  const handleSmilesUpdate = (event: any) => {
    setSmilesInput(event.target.value);
  }

  const handleEmailUpdate = (event: any) => {
    setEmail(event.target.value);
  }

  const handleClick = () => {
    console.log('sending smiles input: ', smilesInput);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "algorithm": "drugcellfindcell",
        "data": smilesInput,
        "customParameters": {
          "--email": email
        }
      })
    };
    fetch(cdapsServer + 'v1', requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('response', data)
        history.push("/analyze/findcells/results/" + data.id)
      }
    );

  }

  return (
    <div className={classes.container}>
      <TextField
        id='standard-multiline-static'
        label="SMILES"
        multiline
        rows={10}
        value={smilesInput}
        placeholder="Enter a SMILES string"
        onChange={handleSmilesUpdate}
      />
       <TextField
        id='standard-multiline-static'
        label="E-mail"
        value={email}
        placeholder="Enter valid e-mail address"
        onChange={handleEmailUpdate}
      />
      <Button disabled={email === undefined} variant="contained" color="primary" onClick={handleClick}>
        Run DrugCell
      </Button>
    </div>
  )
}

export default SmilesEntryPanel;