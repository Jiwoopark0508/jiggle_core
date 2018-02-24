import * as d3 from "d3";
import { setSkeleton } from "./common-parser";

export default function parseBar(chart) {
  const columns = chart.rawData[0];
  chart.data = chart.rawData.slice(1).map((arr, i) => {
    return columns.reduce((acc, col, j) => {
      acc[col] = arr[j];
      return acc;
    }, {});
  });
  const sample = Object.entries(chart.data[0]); //data[0]: first row
  // sample: [["letter", "A"], ["frequency", ".06167"]]
  const firstSeries = sample[0];
  // firstSeries: ["letter", "A"]
  const secondSeries = sample[1];
  // secondSeries: ["frequency", ".06167"]
  if (!isNaN(+secondSeries[1])) {
    // if number then yLabel
    chart.xLabel = firstSeries[0]; // letter
    chart.yLabel = secondSeries[0]; // frequency
  } else {
    chart.xLabel = secondSeries[0];
    chart.yLabel = firstSeries[0];
  }
  chart.keys = [chart.yLabel];
  chart.dataKey = d => d[chart.xLabel];
  chart.xAccessor = d => d[chart.xLabel];
  chart.yAccessor = d => +d[chart.yLabel];

  setSkeleton(chart);

  if (chart.focusType === "startAndEnd") {
    chart.indexToFocus = [0, chart.data.length - 1];
  } else if (chart.focusType === "minAndMax") {
    chart.indexToFocus = [0, 0];
    chart.data.forEach((d, i) => {
      const value = +d[chart.yLabel];
      const min = chart.data[chart.indexToFocus[0]][chart.yLabel];
      const max = chart.data[chart.indexToFocus[1]][chart.yLabel];
      if (value < min) chart.indexToFocus[0] = +i;
      if (value > max) chart.indexToFocus[1] = +i;
    });
  } else if (chart.focusType === "end") {
    chart.indexToFocus = [chart.data.length - 1];
  }

  chart.easing = d3[chart.easingType];
  chart.delayInOrder = (d, i) => {
    const term = 200;
    let eachDelay = 0;
    if (chart.accumedDelay === 0) {
      eachDelay = i * term;
    } else {
      eachDelay = chart.accumedDelay - (chart.data.length - 1 - i) * term;
      // if (eachDelay < 0) eachDelay += chart.accumedDelay;
    }
    return eachDelay;
  };

  chart.x0 = d3
    .scaleBand()
    .domain(chart.data.map(chart.xAccessor))
    .rangeRound([0, chart.width_g_body])
    .padding(chart.paddingBtwRects);
  while (chart.x0.bandwidth() > 50) {
    chart.paddingBtwRects += 0.01;
    chart.x0.padding(chart.paddingBtwRects);
  }
  chart.yScale = d3
    .scaleLinear()
    .domain([0, d3.max(chart.data, chart.yAccessor)])
    .nice()
    .rangeRound([chart.height_g_body, 0]);
  chart.tickArr = chart.yScale.ticks(chart.numOfYAxisTicks);
  chart.arrLen = chart.tickArr.length;
  chart.tickDistance =
    chart.yScale(chart.tickArr[chart.arrLen - 2]) -
    chart.yScale(chart.tickArr[chart.arrLen - 1]);

  // For default color purpose.
  if (chart.id === 1) {
    chart.graph_colors = chart.graph_colors || ["#ADADAD"];
  }
  if (chart.id === 2) {
    chart.graph_colors = chart.graph_colors || [
      "#499fc9",
      "#4a67c6",
      "#af4390",
      "#5d9ec6",
      "#43acaf",
      "#594ac6",
      "#8544aa",
      "#4ac6ae"
    ];
  }

  chart.z = d3.scaleOrdinal().range(chart.graph_colors);
  // console.log(chart.colorToFocus);
  chart.colorToFocus = chart.colorToFocus || "#4AC6AE";

  // chart.BILine = function(g) {
  //   g.selectAll("path.BI").remove();
  //   let path = g.append("path").attr("class", "BI");
  //   const data = d3.range(2);
  //   const lineXScale = d3
  //     .scaleLinear()
  //     .domain(data)
  //     .range([0, chart.width_g_body]);
  //   const lineYScale = d3
  //     .scaleLinear()
  //     .domain(data)
  //     .range([0, 0]);
  //   let line = d3
  //     .line()
  //     .curve(d3.curveLinear)
  //     .x(function(d, i) {
  //       return lineXScale(i);
  //     })
  //     .y(function(d) {
  //       return lineYScale(d);
  //     });
  //   path
  //     .attr("d", line(data))
  //     .attr("stroke", "#3182bd")
  //     .attr("stroke-width", "2")
  //     .attr("fill", "none");
  //   const totalLength = path.node().getTotalLength();
  //   path
  //     .attr("stroke-dasharray", totalLength + " " + totalLength)
  //     .attr("stroke-dashoffset", totalLength)
  //     .transition()
  //     .duration(700)
  //     .delay(500)
  //     .ease(d3.easeLinear)
  //     .attr("stroke-dashoffset", 0);
  // };

  // chart.drawBackground = function(g) {
  //   // g.selectAll("*").remove();
  //   const yAxis = d3
  //     .axisLeft(chart.yScale)
  //     .ticks(chart.numOfYAxisTicks)
  //     .tickSize(-chart.width_g_body)
  //     .tickFormat(d => d);
  //   g
  //     .call(yAxis)
  //     .selectAll(".domain, .tick text")
  //     .style("display", "none");
  //   g
  //     .selectAll(".tick line")
  //     .attr("stroke-width", `${chart.tickDistance}`)
  //     .attr("stroke", function(d, i) {
  //       if (i === chart.arrLen - 1) return null;
  //       let colorStripe;
  //       colorStripe = i % 2 === 0 ? chart.colorStripe2 : chart.colorStripe1;
  //       // console.log(i, d, this, colorStripe);
  //       return colorStripe;
  //     })
  //     .attr("transform", `translate(0,${-chart.tickDistance / 2})`);
  // };

  // chart.customYAxis = function(g) {
  //   const yAxis = d3
  //     .axisLeft(chart.yScale)
  //     .ticks(chart.numOfYAxisTicks)
  //     .tickSize(-chart.width_g_body)
  //     .tickFormat(d => d);
  //   g
  //     .call(yAxis)
  //     .selectAll(".domain, .tick line")
  //     .style("display", "none");
  //   g
  //     .selectAll(".tick text")
  //     .attr("font-size", chart.fontsize_yAxis + "px")
  //     .attr("fill", chart.fontcolor_tickText)
  //     .attr("dx", -2);
  //   // g
  //   //   .selectAll(".tick line")
  //   //   .attr("stroke-width", `${chart.tickDistance}`)
  //   //   .attr("stroke", function(d, i) {
  //   //     let colorStripe;
  //   //     colorStripe = i % 2 === 0 ? chart.colorStripe2 : chart.colorStripe1;
  //   //     // console.log(i, d, this, colorStripe);
  //   //     return colorStripe;
  //   //   })
  //   //   .attr("transform", `translate(0,${-chart.tickDistance / 2})`);
  // };

  // chart.customXAxis = function(g) {
  //   g
  //     .call(d3.axisBottom(chart.x0))
  //     .selectAll(".domain,line")
  //     .style("display", "none");
  //   g
  //     .selectAll(".tick text")
  //     .attr("font-size", chart.fontsize_xAxis + "px")
  //     .attr("fill", chart.fontcolor_tickText);
  // };

  // chart.drawTitle = function(g) {
  //   let s = g.selection ? g.selection() : g;
  //   s
  //     .append("text")
  //     .attr("class", "titleText")
  //     .attr("font-size", chart.fontsize_title + "px")
  //     .attr("font-style", chart.fontstyle_title)
  //     .attr("fill", chart.fontcolor_title)
  //     .text(chart.title);
  // };

  // chart.colorScale = d3
  //   .scaleOrdinal()
  //   .domain()
  //   .range(["#316095", "#4ca8f8", "#512cdb", "#3a84f7"]);
  // chart.xAxis = d3.axisBottom(chart.x0);
}
