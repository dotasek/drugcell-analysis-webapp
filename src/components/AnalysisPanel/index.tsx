import { useParams } from 'react-router-dom'

import React from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./sliderComponents"; // example render components - source below
import { Typography } from '@material-ui/core';

import Histogram from './Histogram'

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
}

const sliderStyle = {
  position: "relative",
  width: "100%",
  marginTop: '1.5em',
  marginBottom: '2.5em',
  marginLeft: '1em',
  marginRight: '1em'
};


const domain : [number, number] = [100, 500];
const defaultValues = [450, 400];

const AnalysisPanel = () => {
  
    const { resultid } = useParams<AnaylsisParamTypes>()
  
    const classes = useStyles()

    const onUpdate = (event: any)=> {
      console.log('slider onUpdate: ', event)
    }

    const onChange = (event : any)=> {
      console.log('slider onChange: ', event)
    }

  return (
    <div className={classes.container}>
        <Typography>{ resultid }
        </Typography>
        <Histogram></Histogram>
        <Slider
          mode={2}
          step={1}
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
    </div>
  )
}

export default AnalysisPanel