import React, { useState, useContext } from 'react';

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import AppContext from '../context/AppContext'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { useHistory } from "react-router-dom";
import { Link, Tooltip, Typography } from '@material-ui/core';

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

const examples =  [
  {
    "name": "Hypoxia",
    "genes": "ADM ADORA2B AK4 AKAP12 ALDOA ALDOB ALDOC AMPD3 ANGPTL4 ANKZF1 ANXA2 ATF3 ATP7A B3GALT6 B4GALNT2 BCAN BCL2 BGN BHLHE40 BNIP3L BRS3 BTG1 CA12 CASP6 CAV1 CCNG2 CCRN4L CDKN1A CDKN1B CDKN1C CHST2 CHST3 CITED2 COL5A1 CP CSRP2 CTGF CXCR4 CXCR7 CYR61 DCN DDIT3 DDIT4 DPYSL4 DTNA DUSP1 EDN2 EFNA1 EFNA3 EGFR ENO1 ENO2 ENO3 ERO1L ERRFI1 ETS1 EXT1 F3 FAM162A FBP1 FOS FOSL2 FOXO3 GAA GALK1 GAPDH GAPDHS GBE1 GCK GCNT2 GLRX GPC1 GPC3 GPC4 GPI GRHPR GYS1 HAS1 HDLBP HEXA HK1 HK2 HMOX1 HOXB9 HS3ST1 HSPA5 IDS IER3 IGFBP1 IGFBP3 IL6 ILVBL INHA IRS2 ISG20 JMJD6 JUN KDELR3 KDM3A KIF5A KLF6 KLF7 KLHL24 LALBA LARGE LDHA LDHC LOX LXN MAFF MAP3K1 MIF MT1E MT2A MXI1 MYH9 NAGK NCAN NDRG1 NDST1 NDST2 NEDD4L NFIL3 NR3C1 P4HA1 P4HA2 PAM PCK1 PDGFB PDK1 PDK3 PFKFB3 PFKL PFKP PGAM2 PGF PGK1 PGM1 PGM2 PHKG1 PIM1 PKLR PKP1 PLAC8 PLAUR PLIN2 PNRC1 PPARGC1A PPFIA4 PPP1R15A PPP1R3C PRDX5 PRKCA PRKCDBP PTRF PYGM RBPJ RORA RRAGD S100A4 SAP30 SCARB1 SDC2 SDC3 SDC4 SELENBP1 SERPINE1 SIAH2 SLC25A1 SLC2A1 SLC2A3 SLC2A5 SLC37A4 SLC6A6 SRPX STBD1 STC1 STC2 SULT2B1 TES TGFB3 TGFBI TGM2 TIPARP TKTL1 TMEM45A TNFAIP3 TPBG TPD52 TPI1 TPST2 UGP2 VEGFA VHL VLDLR WISP2 WSB1 XPNPEP1 ZFP36 ZNF292",
    "description": "The 200 genes comprising the MSigDB Hallmark Gene Set for Hypoxia"
  },
  {
    "name": "Death Receptors",
    "genes": "APAF1 BCL2 BID BIRC2 BIRC3 CASP10 CASP3 CASP6 CASP7 CFLAR CHUK DFFA DFFB FADD GAS2 LMNA MAP3K14 NFKB1 RELA RIPK1 SPTAN1 TNFRSF25 TNFSF10 TRADD TRAF2 XIAP",
    "description": "25 genes involved in the induction of apoptosis through DR3 and DR4/5 Death Receptors"
  },
  {
    "name": "Reactive Oxygen Species",
    "genes": "ABCC1 ATOX1 CAT CDKN2D EGLN2 ERCC2 FES FTL G6PD GCLC GCLM GLRX GLRX2 GPX3 GPX4 GSR HHEX HMOX2 IPCEF1 JUNB LAMTOR5 LSP1 MBP MGST1 MPO MSRA NDUFA6 NDUFB4 NDUFS2 NQO1 OXSR1 PDLIM1 PFKP PRDX1 PRDX2 PRDX4 PRDX6 PRNP PTPA SBNO2 SCAF4 SELENOS SOD1 SOD2 SRXN1 STK25 TXN TXNRD1 TXNRD2",
    "description": "The 49 genes comprising the MSigDB Hallmark Gene Set for Reactive Oxygen Species Processes"
  }
]

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
    return;
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