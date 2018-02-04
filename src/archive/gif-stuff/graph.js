(function() {
  var margin = { top: 100, right: 100, bottom: 100, left: 100 },
    width = 960 - margin.left - margin.right,
    height = 440 - margin.top - margin.bottom;

  var x = d3
    .scaleLinear()
    .domain(d3.extent(d3.range(5)))
    .range([0, width]);

  var y = d3
    .scaleLinear()
    .domain(d3.extent(d3.range(5)))
    .range([0, height]);

  var color = d3
    .scaleLinear()
    .domain(d3.extent(x.domain()))
    .range(["hsl(297,50%,47%)", "hsl(81,78%,61%)"])
    .interpolate(d3.interpolateHcl);

  var svg = d3
    .select("#svg")
    .append("svg")
    .style("background-color", "skyblue")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var dots = g
    .selectAll("circle")
    .data(d3.range(5))
    .enter()
    .append("circle")
    .attr("r", 20)
    .attr("cx", 0)
    .attr("cy", function(d, i) {
      // return y(d);
      return y.call(this, i);
    })
    .style("fill", color);

  // Declare a normal transition
  var t = dots
    .transition()
    .duration(2500)
    .delay(function(d) {
      return d * 100;
    })
    .attr("cx", x)
    .transition()
    .attr("r", 40)
    .filter(function(d) {
      return d % 2;
    })
    .transition()
    .style("opacity", 0);

  // "Record" the transition into a function that can jump to any time
  // `true` means it expects an absolute time in ms
  var jumpToTime = dots.record(true);

  d3
    .select("body")
    .append("div")
    .text("Jump to: ")
    .selectAll("button")
    .data(d3.range(0, 8500, 1000))
    .enter()
    .append("button")
    .text(function(d) {
      return Math.round(d / 1000) + " sec";
    })
    .on("click", jumpToTime);

  makeGIF(svg, d3.select("#gif"), jumpToTime, 8500, 200);
})();
