import * as d3 from "d3";
import moment from "moment";
import _ from "lodash";

export function getChildG(gParent) {
  const layers = [
    "total",
    "body",
    "footer",
    "title",
    "legend",
    "background",
    "image",
    "axis",
    "graph",
    "legend",
    "reference"
  ];
  const childNodes = gParent.selectAll("g").nodes();
  const result = childNodes.reduce((acc, child) => {
    const childSelection = d3.select(child);
    const className = childSelection.attr("class");
    layers.forEach((l, i) => {
      if (className.includes(l)) {
        if (!acc[l]) acc[l] = child;
        else {
          acc[l] = [child].concat(acc[l]);
        }
      }
    });
    return acc;
  }, {});

  return result;
}

export function getImageUrlFromBase64(base64, mimeType) {
  const binary = fixBinary(atob(base64));
  const blob = new Blob([binary], { type: mimeType });
  // const blob = new Blob([binary], { type: "image/png" });
  const url = URL.createObjectURL(blob);

  return url;

  function fixBinary(bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return buf;
  }
}

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
  let radix = Math.pow(10, digit - 1);
  return Math.ceil(num / radix) * radix;
}

export function floor(num, digit = 1) {
  let radix = Math.pow(10, digit - 1);
  return Math.floor(num / radix) * radix;
}

export function refineXAxis(arr, numTick = 4) {
  let ret = [];
  let firstDate = arr[0];
  let lastDate = arr[arr.length - 1];
  let interval = lastDate.diff(firstDate) / numTick;
  for (let i = 0; i <= numTick; i++) {
    let date = moment(firstDate).add(interval * i);
    ret.push(date);
  }
  return ret;
}

export function refineYAxis(arr, numTick = 4) {
  let firstElem = floor(arr[0]);
  let lastElem = floor(arr[arr.length - 1]);
  let radix = String(lastElem - firstElem).length;
  firstElem = floor(firstElem, radix);
  lastElem = ceil(lastElem, radix);
  let interval = (lastElem - firstElem) / numTick;
  return _.range(firstElem, lastElem + 1, interval);
}
