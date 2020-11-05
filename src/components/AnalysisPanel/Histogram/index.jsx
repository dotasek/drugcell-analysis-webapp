import { useParams } from 'react-router-dom'

import React, { useEffect } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import * as d3 from 'd3';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      width: '100%',
      height: '100%',
      display: 'flex'
    }
  }),
)

const Histogram = (props) => {

  const { minSelection, maxSelection } = props;

  console.log("minSelection: " + minSelection);

  const margin = { top: 8, right: 8, bottom: 8, left: 8 };

  let svg;

  const height = 200;
  
  const width = 500;

  const initHistogram = () => {

    //d3.select("#histogram").remove()

    svg = d3.select("#histogram")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

    svg.append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

      
  }

  const drawHistogram = ()=> {
    
    const data = d3.tsv(process.env.PUBLIC_URL + '/a549_drugs_sorted.tsv').then((data) => {
      console.log('data: ', data)

      data.forEach((d) => {
        d.predicted_AUC = parseFloat(d.predicted_AUC)
      })

      var x = d3.scaleLinear()
        .domain([0, 1.05])
        .range([margin.left, width - margin.right])

      const xTicks = x.ticks(21);

      console.log('xTicks: ', xTicks);

      var histogram = d3.bin()
        .value(function (d) { return d.predicted_AUC; })
        .thresholds(xTicks);

      var bins = histogram(data);

      console.log('bins: ', bins);

      var y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([height - margin.bottom, margin.top])

      const svg = d3.select("#histogram svg");

      svg.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => x(d.x0) + 1)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("y", d => y(d.length))
        .attr("height", d => y(0) - y(d.length)).attr("fill", d => (d.x0 >= minSelection && d.x1 <= maxSelection) ? "steelblue" : "gray");
    }).catch((error) => {
      console.error('error' + error)
    });
  }

  useEffect(() => {
    initHistogram();
    drawHistogram();
  }, []);

  useEffect(() => {
    drawHistogram();
  }, [minSelection, maxSelection])

  const classes = useStyles();

  return (
    <div id="histogram"> </div>
  )
}

export default Histogram