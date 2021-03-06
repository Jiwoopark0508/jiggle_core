import * as d3 from "d3";
import { skeleton, GRAPH_COLOR } from "./constant";
import { lineParser, access_gen } from "../parser/line-parser";
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
    const className = childSelection.attr("class") || "";
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
  try {
    let firstDate = arr[0];
    let lastDate = arr[arr.length - 1];
    let interval = lastDate.diff(firstDate) / numTick;
    for (let i = 0; i <= numTick; i++) {
      let date = moment(firstDate).add(interval * i);
      ret.push(date);
    }
    return {ret, valid:true};
  } catch (e) { // it is not time data
    let interval = arr.length / numTick
    return {ret, valid:false};
  }
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

function getFormat(arr) {
  let firstElem = arr[0];
  let lastElem = arr[arr.length - 1];
  lastElem.diff(firstElem);
}

function getChartConfigs(chartList) {
  return chartList[0];
}

export function processChartConfig(chartList) {

  let parsedResult = lineParser(chartList);
  let processedData = parsedResult.result;
  let flatten_data = processedData
    .reduce((rec, d) => {
      return rec.concat(d);
    }, [])
    .reduce((rec, d) => {
      return rec.concat(d);
    }, []);
  let accessors = parsedResult.accessors;
  let header = parsedResult.header;
  let annotations = parsedResult.annotations;

  const chartConfigs = getChartConfigs(chartList);
  const margin = skeleton.global_margin;
  const width_g_total = chartConfigs.width_svg - margin.left - margin.right;
  const height_g_total = chartConfigs.height_svg - margin.top - margin.bottom;

  const xMax =
    chartConfigs.width_svg -
    margin.left -
    margin.right -
    skeleton.graph_margin.left -
    skeleton.graph_margin.right;
  const yMax = skeleton.height_body;

  const x = accessors[0]; // key 
  let flattenY = [];
  accessors.reduce((rec, d) => {
    return rec.concat(d);
  }, []);
  accessors.forEach((f, i) => {
    if (i < 1) return;
    flattenY = flattenY.concat(d3.extent(flatten_data, f));
  });

  let xScaleDomain = d3.extent(flatten_data, x);
  let yScaleDomain = d3.extent(refineYAxis(flattenY.slice()));

  let xTickValues = refineXAxis(xScaleDomain.slice());
  let yTickValues = refineYAxis(flattenY.slice());
  let xTickResult = []
  let xScale = d3.scaleTime().range([0, xMax]).domain(xScaleDomain) 
  let isTime = true
  if (!xTickValues.valid) {
    xScaleDomain = _.map(
      chartList[chartList.length - 1].rawData.slice(1),
      (d, i) => {
        return d[0]
      }
    )
    let y = _.range(0, xMax + 1, xMax / (xScaleDomain.length - 1))
    let x = xScaleDomain
    xTickValues.ret = xScaleDomain
    xScale = d3.scaleOrdinal().range(y).domain(x)
    isTime = false
  }

  const yScale = d3
    .scaleLinear()
    .range([yMax, 0])
    .domain(yScaleDomain);
  const scales = {
    xScale,
    yScale,
    yMax,
    xMax,
    header,
    accessors,
    x,
    chartList,
    yTickValues,
    xTickValues : xTickValues.ret,
    annotations,
    global_margin: {
      top: 40,
      left: 60,
      right: 60,
      bottom: 40
    },
    height_header: 115,
    height_body: 320,
    height_footer: 60,
    graph_margin: {
      left: 160,
      right: 160
    },
    isTime,
    processedData,
    graph_colors: chartConfigs.graph_colors
  };
  const chartConfig = Object.assign({}, chartConfigs, scales);
  return chartConfig;
}

export function formatDate(date, format) {
  return moment(date)
    .format(format)
    .split(" ");
}

export function _addFirstLastBuffer(chartList) {
  chartList[0].delay = 0
  chartList[0].duration = 0
  let firstBuffer = Object.assign({}, chartList[0])
  let lastBuffer = Object.assign({}, chartList[chartList.length - 1])
  if(firstBuffer.rawData.length > 2){
    firstBuffer.duration = 0
    firstBuffer.delay = 0
    firstBuffer.rawData = lastBuffer.rawData.slice(0, 2)
    // firstBuffer.label.splice(0, 0, {row:1, col:1, comment: null})
    chartList.splice(0, 0, firstBuffer)
  }
  lastBuffer.duration = 1000
  lastBuffer.delay = 1000
  chartList.splice(chartList.length - 1, 0, lastBuffer)
  return chartList
}