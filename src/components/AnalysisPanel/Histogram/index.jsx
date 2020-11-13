import { useParams } from 'react-router-dom'

import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import * as d3 from 'd3';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      //width: '100%',
      display: 'flex'
    },
    rightButtons: {
      display: 'flex',
      flexDirection: 'column'
    },
    rightButton: {
      margin: '0.5em'
    }
  }),
)

const Histogram = (props) => {

  const { data, domain, minSelection, maxSelection, height, width } = props;

  console.log("minSelection: " + minSelection);

  //const margin = { top: 8, right: 8, bottom: 8, left: 8 };

  let svg;

  const initHistogram = () => {

    //d3.select("#histogram").remove()

    svg = d3.select("#histogram")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
  }

  const drawHistogram = () => {

    if (data) {
      var x = d3.scaleLinear()
        .domain(domain)
        .range([0, width])

      const xTicks = x.ticks(20);

      console.log('xTicks: ', xTicks);

      var histogram = d3.bin()
        .value(function (d) { return d.predicted_AUC; })
        .thresholds(xTicks);

      var bins = histogram(data);

      console.log('bins: ', bins);

      var y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([height, 0])

      const svg = d3.select("#histogram svg");

      svg.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", d => x(d.x0) + 1)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("y", d => y(d.length))
        .attr("height", d => y(0) - y(d.length)).attr("fill", d => (d.x0 >= minSelection && d.x1 <= maxSelection) ? "steelblue" : "gray");
    }
  }

  useEffect(() => {
    initHistogram();
    drawHistogram();
  }, []);

  useEffect(() => {
    drawHistogram();
  }, [data, minSelection, maxSelection])

  const handleExportClick = () => {
    exportSVG(document.getElementById("histogram").firstElementChild, 'response');
  }

  const exportSVG = (svgEl, name)=> {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const classes = useStyles();

  return (
    <div className={classes.container}><div id="histogram"> </div>
      <div className={classes.rightButtons}>
        <Button className={classes.rightButton} variant="contained" color="primary" onClick={handleExportClick}>
          Export SVG
        </Button>
        <Button className={classes.rightButton} variant="contained" color="primary" >
          Download
        </Button>
      </div>
    </div>
  )
}

export default Histogram