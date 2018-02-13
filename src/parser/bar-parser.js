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
  } else if (chart.focusType === "end") {
    chart.indexToFocus = [chart.data.length - 1];
  }

  chart.width_g = chart.width_svg - chart.margins.left - chart.margins.right;
  chart.height_g = chart.height_svg - chart.margins.top - chart.margins.bottom;

  chart.easing = d3[chart.easing];
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

  chart.xScale = d3
    .scaleBand()
    .domain(chart.data.map(chart.xAccessor))
    .rangeRound([0, chart.width_g])
    .padding(chart.paddingBtwRects);
  chart.yScale = d3
    .scaleLinear()
    .domain([0, d3.max(chart.data, chart.yAccessor)])
    .nice()
    .rangeRound([chart.height_g, 0]);

  chart.BILine = function(path) {
    const data = d3.range(2);
    const lineXScale = d3
      .scaleLinear()
      .domain(data)
      .range([0, chart.width_g]);
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
      .call(
        d3
          .axisLeft(chart.yScale)
          .tickSize(-chart.width_g + chart.margins.right / 2)
          .tickFormat(function(d) {
            return this.parentNode.nextSibling
              ? d
              : `${d}\n(단위: ${chart.unit})`;
          })
      )
      .selectAll(".domain")
      .style("display", "none");

    // let lines = g.selectAll(".tick:not(:first-of-type) line");
    let lines = g.selectAll(".tick line");
    lines.attr("stroke", "#777").attr("stroke-dasharray", "2,2");
    g
      .selectAll(".tick text")
      .attr("x", -12)
      .attr("dy", -4)
      .style("text-anchor", "start");
  };
  chart.customXAxis = function(g) {
    g
      .call(d3.axisBottom(chart.xScale))
      .selectAll(".domain,line")
      .style("display", "none");
  };
  // chart.colorScale = d3
  //   .scaleOrdinal()
  //   .domain()
  //   .range(["#316095", "#4ca8f8", "#512cdb", "#3a84f7"]);
  // chart.xAxis = d3.axisBottom(chart.xScale);
}
