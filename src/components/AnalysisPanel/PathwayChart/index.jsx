import { useParams } from 'react-router-dom'

import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'

import * as d3 from 'd3';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      width: '100%',
      display: 'flex',
      margin: '1em'
    },
    rightButtons: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    rightButton: {
      margin: '0.5em'
    },
    tooltip: {
      position: 'absolute'
    }
  }),
)

const PathwayChart = (props) => {

  const { data, drugName, domain, height, width } = props;

  const margin = { top: 8, right: 8, bottom: 8, left: 100 };

  let svg;

  let tooltip;

  const initChart = () => {

    tooltip = d3.select("#chart").append("div").attr("class", classes.tooltip);

    svg = d3.select("#chart")
      .append("svg")
      .attr("id", 'svg_chart')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    svg.append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
  }

  const drawChart = () => {

    if (data) {
      var x = d3.scaleLinear()
      .range([margin.left, width - margin.right - margin.left]);
      x.domain([0, d3.max(data, function(d){ return d.RLIPP; })])

      var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

      y.domain(data.map(function(d) { return d.pathway_name; }));

      const svg = d3.select("#chart svg");

      svg.selectAll("g.x.axis").remove();
      svg.selectAll("g.y.axis").remove();

      //const tooltip = d3.select('#chart tooltip')

      const chart = svg.selectAll("rect")
        .data(data)
        .join("rect")
      .attr("x", function(d) { return margin.left; })
      .attr("width", function(d) { return x(d.RLIPP) - margin.left; } )
      .attr("y", function(d) { return y(d.pathway_name); })
      .attr("height", y.bandwidth())
      .attr("fill", d => ("steelblue")).on("mouseover", function(event,d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(d.pathway_name + ": " + d.RLIPP)
          .style("left", (event.pageX+10) + "px")
          .style("top", (event.pageY-80) + "px");
        })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
        });

      svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

      svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y));
    }
  }

  useEffect(() => {
    initChart();
    drawChart();
  }, []);

  useEffect(() => {
    drawChart();
  }, [data])

  const handleExportClick = () => {
    exportSVG(document.getElementById('svg_chart'), 'response');
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

  const getPathwayCSV= () => {
    let output = '"pathway_name","RLIPP"\n'
    data.forEach((pathway) => {
      output += '"' + pathway.pathway_name + '",' + pathway.RLIPP + "\n"
    })
    return output
  }

  const exportPathways = () => {
    
    const content = getPathwayCSV();
    
    const a = document.createElement('a')
    const file = new Blob([content], { type: 'application/text' })
    a.href = URL.createObjectURL(file)
    a.download = drugName + '_top_10_pathways.csv'
    a.click()
  }

  const handleDownloadClick = () => {
    exportPathways()
  }

  const classes = useStyles();

  return (
    <div className={classes.container}><div id="chart"> </div>
      <div className={classes.rightButtons}>
        <Button className={classes.rightButton} variant="contained" color="primary" onClick={handleExportClick}>
          Export SVG
        </Button>
        <Button className={classes.rightButton} variant="contained" color="primary" onClick={handleDownloadClick}>
          Download
        </Button>
      </div>
    </div>
  )
}

export default PathwayChart