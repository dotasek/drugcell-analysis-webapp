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
      position: 'absolute',
      zIndex: 1,
      backgroundColor: 'white'
    }
  }),
)

const PathwayChart = (props) => {

  const { data, drugName, domain, height, width } = props;

  const margin = { top: 8, right: 20, bottom: 40, left: 70 };

  let svg;

  let tooltip;

  const initChart = () => {

    tooltip = d3.select("#chart").append("div").attr("class", classes.tooltip);

    svg = d3.select("#chart")
      .append("svg")
      .attr("id", 'svg_chart')
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)

    svg.append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
  }

  const drawChart = () => {

    if (data) {
      var x = d3.scaleLinear()
      .range([margin.left, width - margin.right ]);
      x.domain([0, d3.max(data, function(d){ return d.RLIPP; })])

      var y = d3.scaleBand()
        .range([0, height])
        .padding(0.1);

      y.domain(data.map(function(d) { return d.GO_id; }));

      const svg = d3.select("#chart svg");

      svg.selectAll("g.x.axis").remove();
      svg.selectAll("g.y.axis").remove();
      svg.selectAll("text").remove();

      const tooltip = d3.select('#chart div')

      const chart = svg.selectAll("rect")
        .data(data)
        .join("rect")
      .attr("x", function(d) { return margin.left; })
      .attr("width", function(d) { return x(d.RLIPP) - margin.left; } )
      .attr("y", function(d) { return y(d.GO_id); })
      .attr("height", y.bandwidth())
      .attr("fill", d => ("steelblue")).on("mouseover", function(event,d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(d.pathway_name + "<br>RLIPP: " + d.RLIPP)
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
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");;

      svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + ",0)")
      .call(d3.axisLeft(y));

       // Add X axis label:
       svg.append("text")
       .attr("text-anchor", "end")
       .attr("x", (width / 2) + 60)
       .attr("y", height + margin.bottom + 2 )
       .text("RLIPP Score");
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
          Download CSV
        </Button>
      </div>
    </div>
  )
}

export default PathwayChart