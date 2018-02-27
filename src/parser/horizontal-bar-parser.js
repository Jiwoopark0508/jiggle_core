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

  setSkeleton(chart);

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
  chart.x0 = d3
    .scaleLinear()
    .domain([0, d3.max(chart.data, chart.xAccessor)])
    .nice()
    .rangeRound([0, chart.width_g_body]);
  chart.tickArr = chart.x0.ticks(chart.numOfXAxisTicks);
  chart.arrLen = chart.tickArr.length;
  chart.tickDistance =
    chart.x0(chart.tickArr[chart.arrLen - 1]) -
    chart.x0(chart.tickArr[chart.arrLen - 2]);

  // For default color purpose.
  if (chart.id === 3) {
    chart.graph_colors = chart.graph_colors || ["#499fc9"];
  }
  if (chart.id === 4) {
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
  chart.colorToFocus = chart.colorToFocus || "#e0862d";
}
