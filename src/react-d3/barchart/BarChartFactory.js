import * as d3 from "d3";

export default class BarChartFactory {
  renderChartStatic() {
    const renderer = (svgElement, chart) => {
      this._drawStaticChart(svgElement, chart);
    };
    return renderer;
  }

  renderChartTransition() {
    const renderer = (svgElement, charts) => {
      const g = this._drawStaticChart(svgElement, charts[0]);
      charts.forEach((cht, i) => {
        if (i !== 0) {
          cht.delay += charts[i - 1].duration + charts[i - 1].delay;
          g.call(this._applyTransition, this, cht);
        }
      });
    };
    return renderer;
  }

  _drawStaticChart(svgElement, chart) {
    const { width_g, height_g, xScale, yScale } = this._prepareChart(chart);
    let svg = d3
      .select(svgElement)
      .attr("width", chart.width_svg)
      .attr("height", chart.height_svg);
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
      .attr("x", d => xScale(d[chart.xLabel]))
      .attr("y", d => yScale(d[chart.yLabel]))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height_g - yScale(d[chart.yLabel]));
    g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height_g})`)
      .call(d3.axisBottom(xScale));
    return g;
  }

  _applyTransition(g, that, chart) {
    const { width_g, height_g, xScale, yScale } = that._prepareChart(chart);
    g
      .select(".x.axis")
      .transition()
      .duration(chart.duration)
      .delay(chart.delay)
      .call(d3.axisBottom(xScale));
    // Update selection
    let rect = g.selectAll("rect").data(chart.data, chart.dataKey);
    rect
      .exit() // Exit selection
      .transition()
      .duration(chart.duration / 2)
      .delay(chart.delay)
      .style("opacity", 0)
      .remove();
    rect
      .enter() // Enter selection
      .append("rect")
      .attr("x", d => xScale(d[chart.xLabel]))
      .attr("y", d => height_g)
      .merge(rect) // Enter + Update selection
      .transition()
      .duration(chart.duration)
      .delay(chart.delay)
      .attr("fill", chart.color)
      .call(that._applyFocus, chart) // apply focus
      .attr("x", d => xScale(d[chart.xLabel]))
      .attr("y", d => yScale(d[chart.yLabel]))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height_g - yScale(d[chart.yLabel]));
  }

  _prepareChart(chart) {
    const width_g = chart.width_svg - chart.margins.left - chart.margins.right;
    const height_g =
      chart.height_svg - chart.margins.top - chart.margins.bottom;
    const xScale = d3
      .scaleBand()
      .domain(chart.data.map(chart.xAccessor))
      .rangeRound([0, width_g])
      .padding(0.5);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(chart.data, chart.yAccessor)])
      .nice()
      .rangeRound([height_g, 0]);
    return { width_g, height_g, xScale, yScale };
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
