import * as d3 from "d3";
import { setSkeleton } from "./common-parser";

export default function parseGroupedBar(chart) {
  // chart.shouldTransposed = true;
  // if (chart.shouldTransposed) {
  //   chart.rawData = transposeDsv(chart.rawData, ",");
  // }
  const columns = chart.rawData[0];
  chart.data = chart.rawData.slice(1).map((arr, i) => {
    return columns.reduce((acc, col, j) => {
      acc[col] = j === 0 ? arr[j] : +arr[j];
      return acc;
    }, {});
  });

  chart.xLabel = columns[0]; //xLabel: State
  chart.dataKey = d => d[chart.xLabel];
  chart.keys = columns.slice(1); // ~ 5, 5 ~ 10, 10 ~ 15, etc.
  setSkeleton(chart);

  chart.x0 = d3
    .scaleBand()
    .domain(chart.data.map(d => d[chart.xLabel]))
    .rangeRound([0, chart.width_g_body])
    .paddingInner(0.1);
  while (chart.x0.bandwidth() > 100) {
    chart.paddingBtwRects += 0.01;
    chart.x0.padding(chart.paddingBtwRects);
  }
  chart.x1 = d3
    .scaleBand()
    .domain(chart.keys)
    .rangeRound([0, chart.x0.bandwidth()])
    .padding(0.05);
  chart.yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(chart.data, d => {
        return d3.max(chart.keys, function(key) {
          return d[key];
        });
      })
    ])
    .nice()
    .rangeRound([chart.height_g_body, 0]);
  chart.tickArr = chart.yScale.ticks(chart.numOfYAxisTicks);
  chart.arrLen = chart.tickArr.length;
  chart.tickDistance =
    chart.yScale(chart.tickArr[chart.arrLen - 2]) -
    chart.yScale(chart.tickArr[chart.arrLen - 1]);
  chart.z = d3
    .scaleOrdinal()
    .range([
      "#4180B0",
      "#499FC9",
      "#98abc5",
      "#8a89a6",
      "#7b6888",
      "#6b486b",
      "#a05d56",
      "#d0743c",
      "#ff8c00"
    ]);

  chart.customYAxis = function(g) {
    const yAxis = d3
      .axisLeft(chart.yScale)
      .ticks(chart.numOfYAxisTicks, "s")
      .tickSize(-chart.width_g_body);
    // .tickFormat(d => d);
    g
      .call(yAxis)
      .selectAll(".domain")
      .style("display", "none");
    g
      .selectAll(".tick text")
      .attr("font-size", chart.fontsize_yAxis + "px")
      .attr("fill", chart.fontcolor_tickText)
      .attr("dx", -2);
    g
      .selectAll(".tick line")
      .attr("stroke-width", `${chart.tickDistance}`)
      .attr(
        "stroke",
        (d, i) =>
          i !== 0 && i % 2 === 1 ? chart.colorStripe1 : chart.colorStripe2
      )
      .attr("transform", `translate(0,${-chart.tickDistance / 2})`);
  };

  chart.customXAxis = function(g) {
    const xAxis = d3.axisBottom(chart.x0);
    g
      .call(xAxis)
      .selectAll(".domain, line")
      .style("display", "none");
    g
      .selectAll(".tick text")
      .attr("font-size", chart.fontsize_xAxis + "px")
      .attr("fill", chart.fontcolor_tickText);
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

  chart.drawLegend = function(g) {
    let legend = g
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(chart.keys.slice())
      // .data(chart.keys.slice().reverse())
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });
    legend
      .append("rect")
      // .attr("x", chart.width_g_body - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", chart.z);
    legend
      .append("text")
      // .attr("x", chart.width_g_body - 24)
      .attr("y", 9.5)
      .attr("dx", -5)
      .attr("dy", "0.32em")
      .text(function(d) {
        return d;
      });
  };
}

function transposeDsv(dsv, delimeter = ",") {
  const rows = dsv.split("\n");
  let newStrs = [];
  rows.forEach((row, i) => {
    const columns = row.split(delimeter);
    if (i === 0) {
      for (let k = 0; k < columns.length; k++) {
        newStrs.push("");
      }
    }
    columns.forEach((col, j) => {
      newStrs[j] += col;
      if (i !== rows.length - 1) {
        newStrs[j] += delimeter;
      }
    });
  });
  const newDsv = newStrs.join("\n");
  return newDsv;
}

// function setSkeleton(chart) {
//   const factor_primary_fontsize = 0.08;
//   const factor_secondary_fontsize = 0.045;
//   const factor_tertiary_fontsize = 0.035;
//   const factor_space_between_lines = 4 / 3;
//   const factor_margin_body = 3;

//   chart.width_g_total =
//     chart.width_svg - chart.margins.left - chart.margins.right;
//   chart.width_g_body =
//     chart.width_g_total -
//     (chart.margins.left + chart.margins.right) * factor_margin_body;

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
//   chart.x_g_body = chart.margins.left * factor_margin_body;
//   chart.x_g_legend = chart.width_g_total - chart.margins.right;

//   chart.y_g_total = chart.margins.top;
//   // chart.y_g_header = chart.y_g_total;
//   chart.y_g_body = chart.height_g_header;
//   chart.y_g_xAxis = chart.height_g_body;
//   chart.y_g_footer = chart.y_g_body + chart.height_g_body;
//   chart.y_g_referenceBox = chart.fontsize_reference * 3.5;
//   chart.y_g_madeBy = chart.fontsize_madeBy * factor_space_between_lines;

//   chart.fontcolor_title = chart.fontcolor_title || "#000000";
//   chart.fontcolor_subtitle = chart.fontcolor_subtitle || "#4B4949";
//   chart.fontcolor_unit = chart.fontcolor_unit || "#4B4949";
//   chart.fontcolor_legend = chart.fontcolor_legend || "#4B4949";
//   chart.fontcolor_reference = chart.fontcolor_reference || "#7F7F7F";
//   chart.fontcolor_madeBy = chart.fontcolor_madeBy || "#7F7F7F";
//   chart.fontcolor_graphText = chart.fontcolor_graphText || "#000000";
//   chart.fontcolor_tickText = chart.fontcolor_tickText || "#A0A0A0";
//   chart.colorStripe1 = chart.colorStripe1 || "#F0F0F0";
//   chart.colorStripe2 = chart.colorStripe2 || "#ffffff";
//   chart.colorBI = chart.colorBI || "#3182bd";

//   chart.fontstyle_title = chart.fontstyle_title || "bold";
//   chart.fontstyle_unit = chart.fontstyle_unit || "bold";
//   chart.fontstyle_reference = chart.fontstyle_reference || "bold";
//   chart.fontstyle_madeBy = chart.fontstyle_madeBy || "bold";
// }
