import React, { useState, useContext } from 'react';

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import AppContext from '../context/AppContext'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { useHistory } from "react-router-dom";
import { Link, Tooltip, Typography } from '@material-ui/core';

import examples from '../exampleGeneSets'

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
    examples: {
      textAlign: 'center'
    },
    exampleEntry: {
      padding: '0.25em'
    }
  }),
)



const GeneEntryPanel = (props: any) => {
  const { genes, validGenes, invalidGenes } = props;

  const validGenesText = validGenes ? validGenes.map( (x : string) => x.trim()).join('\n') : undefined;

  const invalidGenesText = invalidGenes ? invalidGenes.map( (x : string) => x.trim()).join('\n') : undefined;

  const [geneInput, setGeneInput] = useState<string | undefined>(genes);

  const { cdapsServer } = useContext(AppContext);

  const classes = useStyles();

  const history = useHistory();

  const handleUpdate = (event: any) => {
    setGeneInput(event.target.value);
  }

  const copyToClipboard = (text : string) => {
    var dummy = document.createElement("textarea");

    document.body.appendChild(dummy);

    dummy.value = text;
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
    startQuery(normalizedGenes)
  }

  const startQuery = (normalizedGenes : string | undefined) => {
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

  const handleExample =(index : number)=> {
    setGeneInput(examples[index].genes)
  }

  const getExampleText = () => {
    const text = examples.map((example, index) => { return ( <div key={example.name}>
      <Tooltip
        title={
          <div style={{ textAlign: 'center' }}>
            {example.description}
          </div>
        }
        placement='bottom'
      >
        <Button
          className='example-text'
          color='inherit'
          onClick={() => handleExample(index)}
        >
          {example.name}
        </Button>
      </Tooltip>
      </div>)})
      return text
  }

  const getHelperText = () => {
    if (geneInput) {
      return undefined;
    }
    return <div className={classes.examples}>
      <Typography> Example input gene sets: </Typography>
      { getExampleText() }
    </div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.item}>
        
      <Typography variant='h6'>
            INPUT
          </Typography>
          <p>
        <TextField
          id='query-field'
          label="Genes"
          helperText= { getHelperText() }
          multiline
          rows={10}
          value={geneInput}
          placeholder="Type genes, or upload from a file below"
          onChange={handleUpdate}
          fullWidth={true}
          variant="outlined"
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
      </p>
      </div>
      
      {
        validGenes &&
        <div className={classes.item}>
          <Typography variant='button'>
            DrugCell query genes used in analysis
          </Typography>
          <TextField
            id='unmatched-genes-field'
            label={ validGenes.length + ' Gene' + (validGenes.length !== 1 ? 's' : '') }
            multiline
            rows={8}
            value={validGenesText}
            fullWidth={true}
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
          />
          <Button
            variant="contained"
            //color="primary"
            onClick={ () => { copyToClipboard(validGenes) }}
            fullWidth={true}>
            Copy to Clipboard
          </Button>
        </div>
      }
      {
        invalidGenes &&
        <div className={classes.item}>
          <Typography variant='button'>
          Non-DrugCell query genes
          </Typography>
          <TextField
            id='unmatched-genes-field'
            label={ invalidGenes.length + ' Gene' + (invalidGenes.length !== 1 ? 's' : '') }
            multiline
            rows={8}
            value={invalidGenesText}
            fullWidth={true}
            InputProps={{
              readOnly: true,
            }}
            variant="filled"
          />
          <Button
            variant="contained"
            //color="primary"
            onClick={  () => { copyToClipboard(invalidGenes) } }
            fullWidth={true}>
            Copy to Clipboard
          </Button>
        </div>
      }
    </div>
  )
}

export default GeneEntryPanel;