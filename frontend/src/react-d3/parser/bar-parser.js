import * as d3 from "d3";

export function parseBar(chart) {
  const columns = chart.rawData[0];
  chart.data = chart.rawData.slice(1).map((arr, i) => {
    return columns.reduce((acc, col, j) => {
      acc[col] = arr[j];
      return acc;
    }, {});
  });
  // console.log(chart.data);
  // chart.data = d3.csvParse(chart.rawData); // array of objects
  const sample = Object.entries(chart.data[0]); //data[0]: first row
  // console.log(sample);
  // sample: [["letter", "A"], ["frequency", ".06167"]]
  const firstSeries = sample[0];
  // firstSeries: ["letter", "A"]
  const secondSeries = sample[1];
  // secondSeries: ["frequency", ".06167"]
  if (!isNaN(+secondSeries[1])) {
    chart.xLabel = firstSeries[0];
    chart.yLabel = secondSeries[0];
  } else {
    chart.xLabel = secondSeries[0];
    chart.yLabel = firstSeries[0];
  }
  chart.dataKey = d => d[chart.xLabel];
  chart.xAccessor = d => d[chart.xLabel];
  chart.yAccessor = d => +d[chart.yLabel];
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
  }

  chart.radius = 6;
  chart.width_g = chart.width_svg - chart.margins.left - chart.margins.right;
  chart.height_g = chart.height_svg - chart.margins.top - chart.margins.bottom;
  chart.xScale = d3
    .scaleBand()
    .domain(chart.data.map(chart.xAccessor))
    .rangeRound([0, chart.width_g])
    .padding(0.5);
  chart.yScale = d3
    .scaleLinear()
    .domain([0, d3.max(chart.data, chart.yAccessor)])
    .nice()
    .rangeRound([chart.height_g, 0]);
  // chart.colorScale = d3
  //   .scaleOrdinal()
  //   .domain()
  //   .range(["#316095", "#4ca8f8", "#512cdb", "#3a84f7"]);
  chart.xAxis = d3.axisBottom(chart.xScale);
  chart.customXAxis = function(g) {
    g
      .call(d3.axisBottom(chart.xScale))
      .selectAll(".domain,line")
      .style("display", "none");
    // g.select(".domain").remove();
    // g
    //   .transition()
    //   .duration(chart.duration)
    //   .delay(chart.accumedDelay);

    // console.log(g.select(".domain"));
  };
}
