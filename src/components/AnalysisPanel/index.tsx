import { useParams } from 'react-router-dom'

import React, { useState, useEffect } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./sliderComponents"; // example render components - source below
import { Typography } from '@material-ui/core';

import Histogram from './Histogram'
import DataTable from './DataTable'

import useDrugs from '../../hooks/useDrugs'

import * as d3 from 'd3'

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
interface AnaylsisParamTypes {
  resultid: string
  genes: string
  q: string
}

const sliderStyle = {
  position: "relative",
  width: "500px",
  marginTop: '1.5em',
  marginBottom: '2.5em',
  marginLeft: '1em',
  marginRight: '1em'
};


const domain : [number, number] = [0, 1.05];
const defaultValues = [0, 1.05];

const AnalysisPanel = (props : any) => {
  
    const params = useParams<AnaylsisParamTypes>();

    const { resultid } = params;
  
    const { genes } = props;

    const classes = useStyles();

    const [minSelection, setMinSelection] = useState(defaultValues[0]);
    const [maxSelection, setMaxSelection] = useState(defaultValues[1]);
    const drugResponse = useDrugs('', genes);
    const [selectedData, setSelectedData] = useState<any>(drugResponse.data);

    console.log('drugResponse.data: ', drugResponse);
    //setSelectedData(drugResponse.data);

    const onUpdate = (event: any)=> {
      console.log('slider onUpdate: ', event)
      setMinSelection(event[0]);
      setMaxSelection(event[1]);
      filterData(event[0], event[1])
    }

    const filterData = (min: number, max: number) => {
      if (drugResponse.data) {
      const selectedData = drugResponse.data.predictions.filter((d : any) => {
        return d.predicted_AUC >= min && d.predicted_AUC <= max;
      })
      setSelectedData(selectedData)}
    }

    const onChange = (event : any)=> {
      console.log('slider onChange: ', event)
    }

    if (drugResponse.isError) {

    }

    if (drugResponse.isLoading) {
      return (
        <Typography>Loading...
        </Typography>
      )
    }

    if (!drugResponse.data) {
      return (
        <Typography>Waiting
        </Typography>
      )
    }

  return (
    <div className={classes.container}>
        <Typography>Result ID: { resultid }
        </Typography>
        <Histogram data={drugResponse.data.predictions} minSelection={minSelection} maxSelection={ maxSelection } height={200} width={500}></Histogram>
        <Slider
          mode={2}
          step={.05}
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
        <Typography>Selection Size: { selectedData ? selectedData.length : 0 }
        </Typography>
        { selectedData && <DataTable data={selectedData} width={500} height={200}></DataTable>}
    </div>
  )
}

export default AnalysisPanel