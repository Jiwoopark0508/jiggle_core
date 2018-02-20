import * as d3 from "d3";
import { setSkeleton } from "./common-parser";

export default function parseHorizontalBar(chart) {
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
    // if secondSeries is number, it goes xLabel
    chart.xLabel = secondSeries[0]; // frequency
    chart.yLabel = firstSeries[0]; // letter
  } else {
    chart.xLabel = firstSeries[0];
    chart.yLabel = secondSeries[0];
  }
  chart.dataKey = d => d[chart.yLabel];
  chart.xAccessor = d => +d[chart.xLabel];
  chart.yAccessor = d => d[chart.yLabel];
  if (chart.focusType === "startAndEnd") {
    chart.indexToFocus = [0, chart.data.length - 1];
  } else if (chart.focusType === "minAndMax") {
    chart.indexToFocus = [0, 0];
    chart.data.forEach((d, i) => {
      const value = +d[chart.xLabel];
      const min = chart.data[chart.indexToFocus[0]][chart.xLabel];
      const max = chart.data[chart.indexToFocus[1]][chart.xLabel];
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

  setSkeleton(chart);

  chart.yScale = d3
    .scaleBand()
    .domain(chart.data.map(chart.yAccessor))
    .rangeRound([0, chart.height_g_body])
    .padding(chart.paddingBtwRects);
  // console.log(chart.yScale.domain());
  while (chart.yScale.bandwidth() > 50) {
    chart.paddingBtwRects += 0.01;
    chart.yScale.padding(chart.paddingBtwRects);
  }
  chart.xScale = d3
    .scaleLinear()
    .domain([0, d3.max(chart.data, chart.xAccessor)])
    .nice()
    .rangeRound([0, chart.width_g_body]);
  chart.tickArr = chart.xScale.ticks(chart.numOfXAxisTicks);
  chart.arrLen = chart.tickArr.length;
  chart.tickDistance =
    chart.xScale(chart.tickArr[chart.arrLen - 1]) -
    chart.xScale(chart.tickArr[chart.arrLen - 2]);

  chart.BILine = function(g) {
    g.selectAll("path.BI").remove();
    let path = g.append("path").attr("class", "BI");
    const data = d3.range(2);
    const lineXScale = d3
      .scaleLinear()
      .domain(data)
      .range([0, chart.width_g_body]);
    const lineYScale = d3
      .scaleLinear()
      .domain(data)
      .range([0, 0]);
    let line = d3
      .line()
      .curve(d3.curveLinear)
      .x(function(d, i) {
        return lineXScale(i);
      })
      .y(function(d) {
        return lineYScale(d);
      });
    path
      .attr("d", line(data))
      .attr("stroke", "#3182bd")
      .attr("stroke-width", "2")
      .attr("fill", "none");
    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(700)
      .delay(500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  };

  chart.customYAxis = function(g) {
    g
      .call(d3.axisLeft(chart.yScale))
      .selectAll(".domain,line")
      .style("display", "none");
    g
      .selectAll(".tick text")
      .attr("font-size", chart.fontsize_yAxis + "px")
      .attr("fill", chart.fontcolor_tickText);
  };

  chart.customXAxis = function(g) {
    const xAxis = d3
      .axisBottom(chart.xScale)
      .ticks(chart.numOfXAxisTicks)
      .tickSize(-chart.height_g_body)
      .tickFormat(d => d);
    g
      .call(xAxis)
      .selectAll(".domain")
      .style("display", "none");
    g
      .selectAll(".tick text")
      .attr("font-size", chart.fontsize_xAxis + "px")
      .attr("fill", chart.fontcolor_tickText)
      .attr("dy", 11);
    g
      .selectAll(".tick line")
      .attr("stroke-width", `${chart.tickDistance}`)
      .attr(
        "stroke",
        (d, i) =>
          i !== 0 && i % 2 === 1 ? chart.colorStripe1 : chart.colorStripe2
      )
      .attr("transform", `translate(${chart.tickDistance / 2},0)`);
  };

  chart.drawTitle = function(g) {
    let s = g.selection ? g.selection() : g;
    s
      .append("text")
      .attr("class", "titleText")
      .attr("font-size", chart.fontsize_title + "px")
      .attr("font-style", chart.fontstyle_title)
      .attr("fill", chart.fontcolor_title)
      .text(chart.title);
  };

  // chart.colorScale = d3
  //   .scaleOrdinal()
  //   .domain()
  //   .range(["#316095", "#4ca8f8", "#512cdb", "#3a84f7"]);
  // chart.xAxis = d3.axisBottom(chart.xScale);
}

// function setSkeleton(chart) {
//   const factor_primary_fontsize = 0.08;
//   const factor_secondary_fontsize = 0.045;
//   const factor_tertiary_fontsize = 0.035;
//   const factor_space_between_lines = 5 / 4;

//   chart.width_g_total =
//     chart.width_svg - chart.margins.left - chart.margins.right;
//   chart.width_g_body =
//     chart.width_g_total - chart.margins.left - chart.margins.right;

//   chart.height_g_total =
//     chart.height_svg - chart.margins.top - chart.margins.bottom;

//   chart.fontsize_title =
//     chart.fontsize_title || chart.height_g_total * factor_primary_fontsize;
//   chart.fontsize_subtitle =
//     chart.fontsize_subtitle || chart.height_g_total * factor_secondary_fontsize;
//   chart.fontsize_unit =
//     chart.fontsize_unit || chart.height_g_total * factor_secondary_fontsize;
//   chart.fontsize_legend =
//     chart.fontsize_legend || chart.height_g_total * factor_secondary_fontsize;
//   chart.fontsize_reference =
//     chart.fontsize_reference || chart.height_g_total * factor_tertiary_fontsize;
//   chart.fontsize_madeBy =
//     chart.fontsize_madeBy || chart.height_g_total * factor_tertiary_fontsize;
//   chart.fontsize_yAxis =
//     chart.fontsize_yAxis || chart.height_g_total * factor_tertiary_fontsize;
//   chart.fontsize_xAxis =
//     chart.fontsize_xAxis || chart.height_g_total * factor_tertiary_fontsize;
//   chart.fontsize_graphText =
//     chart.fontsize_graphText || chart.height_g_total * factor_tertiary_fontsize;

//   chart.y_g_title = chart.fontsize_title;
//   chart.y_g_subtitle =
//     chart.y_g_title * factor_space_between_lines + chart.fontsize_subtitle;

//   chart.height_g_header = chart.y_g_subtitle + chart.fontsize_subtitle * 2;
//   chart.height_g_footer = chart.height_g_total / 7;
//   chart.height_g_body =
//     chart.height_g_total - chart.height_g_header - chart.height_g_footer;

//   chart.x_g_total = chart.margins.left;
//   chart.x_g_body = chart.margins.left;

//   chart.y_g_total = chart.margins.top;
//   // chart.y_g_header = chart.y_g_total;
//   chart.y_g_body = chart.height_g_header;
//   chart.y_g_xAxis = chart.height_g_body;
//   chart.y_g_footer = chart.y_g_body + chart.height_g_body;
//   chart.y_g_referenceBox = chart.fontsize_reference * 3;
//   chart.y_g_madeBy = chart.fontsize_madeBy * factor_space_between_lines;

//   chart.fontcolor_title = chart.fontcolor_title || "#000000";
//   chart.fontcolor_subtitle = chart.fontcolor_subtitle || "#4B4949";
//   chart.fontcolor_unit = chart.fontcolor_unit || "#4B4949";
//   chart.fontcolor_legend = chart.fontcolor_legend || "#4B4949";
//   chart.fontcolor_reference = chart.fontcolor_reference || "#7F7F7F";
//   chart.fontcolor_madeBy = chart.fontcolor_madeBy || "#7F7F7F";
//   chart.fontcolor_graphText = chart.fontcolor_graphText || "#000000";
//   chart.colorStripe1 = chart.colorStripe1 || "#F0F0F0";
//   chart.colorStripe2 = chart.colorStripe2 || "#ffffff";
//   chart.colorBI = chart.colorBI || "#3182bd";

//   chart.fontstyle_title = chart.fontstyle_title || "bold";
//   chart.fontstyle_unit = chart.fontstyle_unit || "bold";
//   chart.fontstyle_reference = chart.fontstyle_reference || "bold";
//   chart.fontstyle_madeBy = chart.fontstyle_madeBy || "bold";
// }
