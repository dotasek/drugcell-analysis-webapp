

import React, { useState, useEffect } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import GeneEntryPanel from '../GeneEntryPanel'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    }
  }),
)


const FindDrugQuery = (props: any) => {

  const { data } = props;

  const classes = useStyles();

  return (
    <div className={classes.container}>
        <GeneEntryPanel buttonText = { 'Run DrugCell' }></GeneEntryPanel>
    </div>
  )
}

export default FindDrugQuery