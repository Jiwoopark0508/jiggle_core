import * as d3 from "d3";

export default class GroupedBarFactory {
  renderChart() {
    const renderer = (svgElement, chart) => {
      this._drawChart(svgElement, chart);
    };
    return renderer;
  }

  renderTransition() {
    const renderer = (svgElement, charts) => {
      const g = this._drawChart(svgElement, charts[0]);
      charts.forEach((cht, i) => {
        if (i !== 0) {
          cht.delay += charts[i - 1].duration + charts[i - 1].delay;
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
      .attr("height", chart.height_svg);
    let g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${chart.margins.left},${chart.margins.top})`
      );
    g
      .append("g")
      .selectAll("g")
      .data(chart.data)
      .enter()
      .append("g")
      .attr("transform", function(d) {
        return `translate(${chart.x0(d[chart.xLabel])},0)`;
      })
      .selectAll("rect")
      .data(function(d) {
        return chart.keys.map(function(key) {
          return { key: key, value: d[key] };
        });
      })
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return chart.x1(d.key);
      })
      .attr("y", function(d) {
        return chart.y(d.value);
      })
      .attr("width", chart.x1.bandwidth())
      .attr("height", function(d) {
        return chart.height_g - chart.y(d.value);
      })
      .attr("fill", function(d) {
        return chart.z(d.key);
      });

    g
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${chart.height_g})`)
      .call(d3.axisBottom(chart.x0));

    g
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(chart.y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", chart.y(chart.y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      // .text("Population");
      .text(chart.yLabel);

    let legend = g
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(chart.keys.slice().reverse())
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend
      .append("rect")
      .attr("x", chart.width_g - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", chart.z);

    legend
      .append("text")
      .attr("x", chart.width_g - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) {
        return d;
      });
  }

  _applyTransition() {}

  _prepareChart() {}

  _applyFocus() {}
}
