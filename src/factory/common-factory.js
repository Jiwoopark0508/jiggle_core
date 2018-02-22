import * as d3 from "d3";

export function drawXLine(g, chart) {
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
    // .attr("stroke", chart.colorBI)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("fill", "none");
  const totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", 0);
}

export function drawYLine(g, chart) {
  g.selectAll("path.BI").remove();
  let path = g.append("path").attr("class", "BI");
  const data = d3.range(2);
  const lineXScale = d3
    .scaleLinear()
    .domain(data)
    .range([0, 0]);
  const lineYScale = d3
    .scaleLinear()
    .domain(data)
    .range([0, chart.height_g_body]);
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
    // .attr("stroke", chart.colorBI)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("fill", "none");
  const totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", 0);
}

export function drawSkeleton(svgElement, chart) {
  let svg = d3.select(svgElement);
  svg.selectAll("*").remove();
  // svg.selectAll("*:not(#images)").remove();
  svg
    .attr("width", chart.width_svg)
    .attr("height", chart.height_svg)
    .style("background-color", chart.backgroundColor)
    .style("user-select", "none")
    .style("font-family", chart.fontFamily);
  let gTotal = svg
    .append("g")
    .attr("class", "total")
    .attr("transform", `translate(${chart.x_g_total}, ${chart.y_g_total})`);
  let gBody = gTotal
    .append("g")
    .attr("class", "body")
    .attr("transform", `translate(${chart.x_g_body}, ${chart.y_g_body})`);
  let gHeader = gTotal.append("g").attr("class", "header");
  let gFooter = gTotal
    .append("g")
    .attr("class", "footer")
    .attr("transform", `translate(0, ${chart.y_g_footer})`);

  let gTitleBox = gHeader.append("g").attr("class", "titleBox");
  let gLegend = gHeader
    .append("g")
    .attr("class", "legendBox")
    .attr("transform", `translate(${chart.width_g_total}, 0)`)
    .style("text-anchor", "end");

  let gBackground = gBody.append("g").attr("class", "background");
  let gImage = gBody.append("g").attr("class", "imageG");
  let gYAxis = gBody.insert("g", ".imageG").attr("class", "y axis");
  let gGraph = gBody.append("g").attr("class", "graph");
  let gXAxis = gBody
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${chart.y_g_xAxis})`);
  // if (chart.type && chart.type.includes("horizontal")) {
  //   gYAxis.remove();
  //   gYAxis = gGraph.append("g").attr("class", "y axis");
  // }

  let gReferenceBox = gFooter
    .append("g")
    .attr("class", "referenceBox")
    .attr("transform", `translate(0, ${chart.y_g_referenceBox})`);

  let gTitle = gTitleBox
    .append("g")
    .attr("class", "titleG")
    // .attr("transform", `translate(0, ${chart.fontsize_title})`)
    .style("font-weight", 700);
  let gSubtitle = gTitleBox
    .append("g")
    .attr("class", "subtitleG")
    .attr("transform", `translate(0, ${chart.y_g_subtitle})`);

  let gReference = gReferenceBox.append("g").attr("class", "reference");
  let gMadeBy = gReferenceBox
    .append("g")
    .attr("class", "madeBy")
    .attr("transform", `translate(0, ${chart.y_g_madeBy})`);

  return {
    svg,
    gTotal,
    gHeader,
    gBody,
    gFooter,
    gTitleBox,
    gLegend,
    gBackground,
    gImage,
    gXAxis,
    gYAxis,
    gGraph,
    gReferenceBox,
    gTitle,
    gSubtitle,
    gReference,
    gMadeBy
  };
}

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

export function getAllTweeners(g) {
  let tweeners = [];
  const allElements = g.selectAll("*");
  allElements.each(function(d, i) {
    const node = this;
    const pending = d3
      .entries(this.__transition)
      .filter(function(tr) {
        return tr.key !== "active" && tr.key !== "count";
      })
      .map(function(tr) {
        return tr.value;
      });
    if (pending.length === 0) return;
    pending.forEach(function(tran, i) {
      if (tran.tween.length === 0) return;
      var ease = tran.ease || (d => d);
      tran.tween.forEach(function(tween) {
        const tweener = (tween.value.call(node, d, i) || (() => {})).bind(node);
        (function(idx) {
          tweeners.push(function(t) {
            if (t >= tran.delay && t < tran.delay + tran.duration) {
              const relativeTime = (t - tran.delay) / tran.duration;
              tweener(ease(relativeTime));
            }
          });
        })(i);
      });
    });
  });
  return tweeners;
}
