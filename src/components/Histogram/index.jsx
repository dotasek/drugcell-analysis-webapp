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
      flexDirection: 'column',
      justifyContent: 'center'
    },
    rightButton: {
      margin: '0.5em'
    }
  }),
)

const Histogram = (props) => {

  const { data, domain, minSelection, maxSelection, height, width } = props;

  console.log("minSelection: " + minSelection);

  const margin = { top: 8, right: 8, bottom: 20, left: 48 };

  let svg;

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

  const drawHistogram = () => {

    if (data) {
      var x = d3.scaleLinear()
        .domain(domain)
        .range([margin.left, width - margin.right])

      const xTicks = x.ticks(21);

      console.log('xTicks: ', xTicks);

      var histogram = d3.bin()
        .value(function (d) { return d.predicted_AUC; })
        .thresholds(xTicks);

      var bins = histogram(data);

      //console.log('bins: ', bins);

      var y = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]).nice()
        .range([height - margin.bottom, margin.top])

      const svg = d3.select("#histogram svg");

      svg.selectAll("g.x.axis").remove();
      svg.selectAll("g.y.axis").remove();

      svg.selectAll("text").remove();

      svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x));

      // Add X axis label:
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", (width / 2) + 60)
        .attr("y", height + margin.bottom )
        .text("Predicted AUC");

      // Y axis label:
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x", -(height / 2) + 60)
        .text("Number of Drugs")

      var rect = svg.selectAll("rect")
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



  const exportResults = () => {

    const content = JSON.stringify(data);

    const a = document.createElement('a')
    const file = new Blob([content], { type: 'application/json' })
    a.href = URL.createObjectURL(file)
    a.download = 'drugcell_predictions.json'
    a.click()
  }

  const exportSVG = (svgEl, name) => {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
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
      </div>
    </div>
  )
}

export default Histogram