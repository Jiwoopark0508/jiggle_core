import * as d3 from "d3";
import moment from 'moment'
import _ from 'lodash'

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

export function ceil(num, digit = 1) {
  let radix = Math.pow(10, digit - 1)
  return Math.ceil(num / radix) * radix
}

export function floor(num, digit = 1) {
  let radix = Math.pow(10, digit - 1)
  return Math.floor(num / radix) * radix
}

export function refineXAxis(arr, numTick=4) {
  let ret = []
  let firstDate = arr[0]
  let lastDate = arr[arr.length - 1]
  let interval = lastDate.diff(firstDate) / numTick
  for(let i = 0; i <= numTick; i++){
    let date = moment(firstDate).add(interval * i)
    ret.push(date)
  }
  return ret
}

export function refineYAxis(arr, numTick = 4) {
  let firstElem = floor(arr[0])
  let lastElem = floor(arr[arr.length - 1])
  let radix = String(lastElem - firstElem).length
  firstElem = floor(firstElem, radix)
  lastElem = ceil(lastElem, radix)
  let interval = (lastElem - firstElem) / numTick
  return _.range(firstElem, lastElem + 1, interval)
}

export function formatDate(date, format) {
  return moment(date).format(format).split(' ')
}