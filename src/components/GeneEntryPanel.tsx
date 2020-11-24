import React, { useState, useContext } from 'react';

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import AppContext from '../context/AppContext'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { useHistory } from "react-router-dom";
import { Typography } from '@material-ui/core';

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
  const { genes, filteredGenes } = props;

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
        "data": geneInput?.toUpperCase()
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

  const handleUpload = ( event : any ) => {
    const fileReader = new FileReader();
    //const name = target.accept.includes('image') ? 'images' : 'videos';

    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (e) => {
      console.log('fileReader.onload: ', e.target);
      if (e.target && e.target.result && typeof e.target.result === "string") {
        const resultString = e.target.result;
        setGeneInput(resultString)
      }
    };
};

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
      <Button
        variant="contained"
        component="label"
      >
        Load Genes from File
          <input id="fileInput"
          type="file"
          onChange={handleUpload}
          hidden
        />
      </Button>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Run DrugCell
      </Button>

      <Typography>
        Unmatched Genes ({filteredGenes.length})
      </Typography>

    </div>
  )
}

export default GeneEntryPanel;