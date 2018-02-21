import * as d3 from "d3";
import { drawSkeleton, getAllTweeners, drawXLine } from "./common-factory";

export default class GroupedBarFactory {
  renderChart() {
    const renderer = (svgElement, chart) => {
      this._drawChart(this, svgElement, chart);
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

  _drawChart(that, svgElement, chart) {
    let {
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
    } = drawSkeleton(svgElement, chart);
    gXAxis.call(chart.customXAxis);
    gYAxis.call(chart.customYAxis);
    gTitle.call(chart.drawTitle);
    gXAxis.call(drawXLine, chart);
    gSubtitle
      .append("text")
      .attr("class", "subtitleText")
      .attr("font-size", chart.fontsize_subtitle + "px")
      .attr("fill", chart.fontcolor_subtitle)
      .text(chart.subtitle);
    const graphRect = gGraph
      .selectAll("g.graphRect")
      .data(chart.data)
      .enter()
      .append("g")
      .attr("class", "graphRect")
      .attr("transform", function(d) {
        return `translate(${chart.x0(d[chart.xLabel])},0)`;
      });
    graphRect
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
        return chart.yScale(d.value);
      })
      .attr("width", chart.x1.bandwidth())
      .attr("height", function(d) {
        const hi = chart.height_g_body - chart.yScale(d.value);
        return chart.height_g_body - chart.yScale(d.value);
      })
      .attr("fill", function(d) {
        return chart.z(d.key);
      });
    graphRect
      .selectAll("text.graphText")
      .data(function(d) {
        return chart.keys.map(function(key) {
          return { key: key, value: d[key] };
        });
      })
      .enter()
      .append("text")
      .attr("class", "graphText")
      .attr("font-size", chart.fontsize_graphText + "px")
      .attr("fill", chart.fontcolor_graphText)
      .attr("x", d => chart.x1(d.key))
      .attr("y", d => chart.yScale(d.value))
      .attr("dx", chart.x1.bandwidth() / 2)
      .attr("dy", "-0.5em")
      .attr("text-anchor", "middle")
      .text(d => d.value);

    // g
    //   .append("g")
    //   .attr("class", "axis")
    //   .attr("transform", `translate(0,${chart.height_g})`)
    //   .call(d3.axisBottom(chart.x0));

    // g
    //   .append("g")
    //   .attr("class", "axis")
    //   .call(d3.axisLeft(chart.y).ticks(null, "s"))
    //   .append("text")
    //   .attr("x", 2)
    //   .attr("y", chart.y(chart.y.ticks().pop()) + 0.5)
    //   .attr("dy", "0.32em")
    //   .attr("fill", "#000")
    //   .attr("font-weight", "bold")
    //   .attr("text-anchor", "start")
    //   // .text("Population");
    //   .text(chart.yLabel);
    gLegend.call(chart.drawLegend);

    gReference
      .append("text")
      .attr("class", "referenceText")
      .attr("font-size", chart.fontsize_reference + "px")
      .attr("font-style", chart.fontstyle_reference)
      .attr("fill", chart.fontcolor_reference)
      .text(`자료 출처: ${chart.reference}`);
    gMadeBy
      .append("text")
      .attr("class", "madeByText")
      .attr("font-size", chart.fontsize_madeBy + "px")
      .attr("font-style", chart.fontstyle_madeBy)
      .attr("fill", chart.fontcolor_madeBy)
      .text(`만든이: ${chart.madeBy}`);
  }
}
