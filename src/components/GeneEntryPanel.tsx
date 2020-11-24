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
    },
    item: {
      paddingTop: '1em'

    },
  }),
)

const GeneEntryPanel = (props: any) => {
  const { genes, filteredGenes } = props;

  const filteredGenesText = filteredGenes ? filteredGenes.map( (x : string) => x.trim()).join('\n') : undefined;

  const [geneInput, setGeneInput] = useState<string | undefined>(genes);

  const { cdapsServer } = useContext(AppContext);

  const classes = useStyles();

  const history = useHistory();

  const handleUpdate = (event: any) => {
    setGeneInput(event.target.value);
  }

  const copyUnmatchedGenesToClipboard = () => {
    var dummy = document.createElement("textarea");

    document.body.appendChild(dummy);

    dummy.value = filteredGenesText;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    console.log('copied');
  }

  const handleClick = () => {
    console.log('sending gene input: ', geneInput);

    //Split on any non-alphanumeric except '-' and join with ','
    //DrugCell internally requires uppercase
    const normalizedGenes = geneInput?.split(/[^A-Za-z0-9-]/).filter(x => x.length > 0).join(',').toUpperCase();

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "algorithm": "drugcellfinddrug",
        "data": normalizedGenes
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

  const handleUpload = (event: any) => {
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
      <div className={classes.item}>
        <TextField
          id='query-field'
          label="Query Genes"
          multiline
          rows={10}
          value={geneInput}
          placeholder="Enter a list of comma delimited genes"
          onChange={handleUpdate}
          fullWidth={true}
        />
        <Button
          variant="contained"
          component="label"
          fullWidth={true}
        >
          Load Genes from File
          <input id="fileInput"
            type="file"
            onChange={handleUpload}
            hidden
          />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          fullWidth={true}>
          Run DrugCell
      </Button>
      </div>
      {
        filteredGenes &&
        <div className={classes.item}>
          <TextField
            id='unmatched-genes-field'
            label={"Unmatched Genes: " + filteredGenes.length}
            multiline
            rows={8}
            value={filteredGenesText}
            fullWidth={true}
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={ copyUnmatchedGenesToClipboard }
            fullWidth={true}>
            Copy to Clipboard
          </Button>
        </div>
      }
    </div>
  )
}

export default GeneEntryPanel;