import { useParams } from 'react-router-dom'

import React from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex'
    }
  }),
)
interface AnaylsisParamTypes {
  resultid: string
}


const AnalysisPanel = () => {
  
    const { resultid } = useParams<AnaylsisParamTypes>()
  
    const classes = useStyles()

  return (
    <div className={classes.container}>
        { resultid }
    </div>
  )
}

export default AnalysisPanel