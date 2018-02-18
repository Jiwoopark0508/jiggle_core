import * as d3 from "d3";

export function ParseData(chart) {
  // let chart = {};
  chart.data = d3.csvParse(chart.rawData); // array of objects
  const sample = Object.entries(chart.data[0]);
  const firstSeries = sample[0];
  const secondSeries = sample[1];
  chart.xLabel = firstSeries[0];
  chart.yLabel = secondSeries[0];
  // chart.dataFormatter = d => {
  //   return {
  //     [chart.xLabel]: d[chart.xLabel],
  //     [chart.yLabel]: +d[chart.yLabel]
  //   };
  // };
  chart.dataKey = d => d[chart.xLabel];
  chart.xAccessor = d => d[chart.xLabel];
  chart.yAccessor = d => +d[chart.yLabel];
  if (chart.focusType === "startAndEnd") {
    chart.indexToFocus = [0, chart.data.length - 1];
  } else if (chart.focusType === "minAndMax") {
    chart.indexToFocus = [0, 0];
    for (let i in chart.data) {
      const value = +chart.data[i][chart.yLabel];
      const min = chart.data[chart.indexToFocus[0]][chart.yLabel];
      const max = chart.data[chart.indexToFocus[1]][chart.yLabel];
      if (value < min) chart.indexToFocus[0] = +i;
      if (value > max) chart.indexToFocus[1] = +i;
    }
  }
  // Object.assign(props.charts[0], chartData1);

  // return chart;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function ceil(num, digit) {
  let radix = Math.pow(10, digit - 1)
  return Math.ceil(num / radix) * radix
}

export function floor(num, digit) {
  let radix = Math.pow(10, digit - 1)
  return Math.floor(num / radix) * radix
}