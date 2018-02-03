import * as d3 from "d3";
import makeGIF from "../../gif/makeGIF";
import recordTransition from "../../gif/d3-record";

export default class BarFactory {
  renderChart() {
    const renderer = (svgElement, chart) => {
      this._drawChart(svgElement, chart);
    };
    return renderer;
  }

  renderTransition() {
    const renderer = (svgElement, charts, shouldMakeGIF = false) => {
      let g = this._drawChart(svgElement, charts[0]);
      charts.forEach((cht, i) => {
        if (i !== 0) {
          cht.accumedDelay =
            cht.delay + charts[i - 1].duration + charts[i - 1].accumedDelay;
          g.call(this._applyTransition, this, cht);
        }
      });
    };
    return renderer;
  }

  _drawChart(svgElement, chart) {
    let svg = d3
      .select(svgElement)
      .attr("width", chart.width_svg)
      .attr("height", chart.height_svg)
      .style("background-color", chart.backgroundColor);
    let g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${chart.margins.left},${chart.margins.top})`
      );
    g
      .selectAll("rect")
      .data(chart.data, chart.dataKey)
      .enter()
      .append("rect")
      .attr("fill", "steelblue")
      .call(this._applyFocus, chart)
      .attr("x", d => chart.xScale(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("width", chart.xScale.bandwidth())
      .attr("height", d => chart.height_g - chart.yScale(d[chart.yLabel]));
    g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${chart.height_g})`)
      .call(d3.axisBottom(chart.xScale));
    return g;
  }

  _applyTransition(g, that, chart) {
    g
      .select(".x.axis")
      .transition()
      .duration(chart.duration)
      .delay(chart.accumedDelay)
      .call(d3.axisBottom(chart.xScale));
    // Update selection
    let rect = g.selectAll("rect").data(chart.data, chart.dataKey);

    rect
      .exit() // Exit selection
      .transition()
      .duration(chart.duration / 2)
      .delay(chart.accumedDelay)
      .style("opacity", 0)
      .remove();

    rect
      .enter() // Enter selection
      .append("rect")
      .attr("x", d => chart.xScale(d[chart.xLabel]))
      .attr("y", d => chart.height_g)
      .merge(rect) // Enter + Update selection
      .transition()
      .duration(chart.duration)
      .delay(chart.accumedDelay)
      .attr("fill", chart.color)
      .call(that._applyFocus, chart) // apply focus
      .attr("x", d => chart.xScale(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("width", chart.xScale.bandwidth())
      .attr("height", d => chart.height_g - chart.yScale(d[chart.yLabel]));
  }

  _applyFocus(rect, chart) {
    if (chart.focusType === "startAndEnd" || chart.focusType === "minAndMax") {
      rect
        .attr(
          "fill",
          (d, i) =>
            chart.indexToFocus.includes(i) ? chart.colorToFocus : chart.color
        )
        .style(
          "opacity",
          (d, i) =>
            chart.indexToFocus.includes(i) ? chart.opacity : chart.opacityToHide
        );
    }
  }

  // deprecated
  _checkDiffsForTransition(origChart, nextChart) {
    const diffs = {};
    for (let key in nextChart) {
      if (origChart[key] !== nextChart[key]) {
        diffs[key] = nextChart[key];
      }
    }
    return diffs;
  }
}
