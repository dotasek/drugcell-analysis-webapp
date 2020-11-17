

import React, { useState, useEffect } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./sliderComponents"; // example render components - source below
import { Typography } from '@material-ui/core';

import Histogram from './Histogram'
import DataTable from './DataTable'

import PathwayChart from './PathwayChart';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column'
    },
    resultPanel: {
      margin: '1em'
    },
    instructionText: {
      fontStyle: 'italic'
    }
  }),
)

const sliderStyle = {
  position: "relative",
  width: "500px",
  marginTop: '1.5em',
  marginBottom: '4em',
  marginLeft: '1em',
  marginRight: '1em'
};

const AnalysisPanel = (props: any) => {

  const { data } = props;

  data.predictions.sort((a: any, b: any) => { return b.predicted_AUC - a.predicted_AUC })

  const classes = useStyles();

  const max_AUC = data.predictions.reduce((a: number, entry: any) => {
    return a > entry.predicted_AUC ? a : entry.predicted_AUC
  }, 0);

  const step = max_AUC / 100;

  const domainMax = Math.ceil(max_AUC / step) * step;

  const defaultValues = [0, domainMax];

  const [minSelection, setMinSelection] = useState(0);
  const [maxSelection, setMaxSelection] = useState(domainMax);

  const [selectedData, setSelectedData] = useState<any>(data.predictions);

  const [selectedPathways, setSelectedPathways] = useState<any>()
  const [selectedDrug, setSelectedDrug] = useState<any>()

  const onUpdate = (event: any) => {
    // console.log('slider onUpdate: ', event)
    setMinSelection(event[0]);
    setMaxSelection(event[1]);
    filterData(event[0], event[1])
  }

  const domain: [number, number] = [0, domainMax];

  const filterData = (min: number, max: number) => {
    if (data) {
      const selectedData = data.predictions.filter((d: any) => {
        return d.predicted_AUC >= min && d.predicted_AUC <= max;
      })
      setSelectedData(selectedData)
    }
  }

  const onChange = (event: any) => {
    //console.log('slider onChange: ', event)
  }

  const onSelectDrug = (drug: any) => {
    setSelectedDrug(drug.drug_name)
    setSelectedPathways(drug.top_pathways);
  }

  const histogramData = data.predictions.map((entry: any) => {
    return { drug_name: entry.drug_name, predicted_AUC: entry.predicted_AUC }
  }
  )

  return (
    <div className={classes.container}>
      <div className={classes.resultPanel}>
        <Typography variant='h6'>Histogram of Drugs by Predicted AUC</Typography>
       
        <Histogram data={histogramData} domain={domain} minSelection={minSelection} maxSelection={maxSelection} height={200} width={500}></Histogram>
        <Typography variant='subtitle2'>Drag slider handles to select drugs for a range of AUC values.</Typography>
        
        <Slider
          mode={2}
          step={step}
          domain={domain}
          rootStyle={sliderStyle}
          onUpdate={onUpdate}
          onChange={onChange}
          values={defaultValues}
        >
          <Rail>
            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={domain}
                    getHandleProps={getHandleProps}
                  />
                ))}
              </div>
            )}
          </Handles>
          <Tracks left={false} right={false}>
            {({ tracks, getTrackProps }) => (
              <div className="slider-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                ))}
              </div>
            )}
          </Tracks>
          <Ticks count={5}>
            {({ ticks }) => (
              <div className="slider-ticks">
                {ticks.map(tick => (
                  <Tick key={tick.id} tick={tick} count={ticks.length} />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
        
        <Typography variant='caption'>
          Minimum AUC: {minSelection} Maximum AUC: {maxSelection} Drugs Selected: {selectedData ? selectedData.length : 0}
        </Typography>
       
      </div>


      { selectedData &&
        <div className={classes.resultPanel}>
          <Typography variant='h6'>Selected Drugs</Typography>
          <Typography variant='subtitle1'>
            Select a drug to view it's top 10 pathways according to RLIPP below.
          </Typography>
          <DataTable data={selectedData} selectedDrug={selectedDrug} onSelectDrug={onSelectDrug} width={500} height={400}></DataTable>
        </div>
      }
      { selectedPathways && 
        <div className={classes.resultPanel}>
          <Typography variant='h6'>Top Pathways for {selectedDrug} by RLIPP</Typography>
          <PathwayChart data={selectedPathways} drugName={selectedDrug} width={500} height={200}></PathwayChart>
        </div>}
    </div>
  )
}

export default AnalysisPanel