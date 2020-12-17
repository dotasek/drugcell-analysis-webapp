import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  helpImage: {
    width: '90%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

const Genes = () => {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h6">
        DrugCell Genes
        </Typography>
      <p>
        <Typography>
        DrugCell genes are the top 15% most frequently mutated genes (3,008 genes) in human cancer cell lines according to the Cancer Cell Line Encyclopedia (CCLE) (Barretina et al., 2012) among genes annotated to Gene Ontology (GO) terms (Ashburner et al., 2000). DrugCell genes were used in model construction and are used in the DrugCell analysis performed by Genotype Analyzer. For each input gene set, the Genotype Analyzer filters out genes that are not DrugCell genes.
        </Typography></p>
    </div>
  );
}

export default Genes;

