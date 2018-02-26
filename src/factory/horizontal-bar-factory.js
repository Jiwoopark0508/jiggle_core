// import * as d3 from "d3";
import CommonFactory from "./common-factory";

export default class HorizontalBarFactory extends CommonFactory {
  _drawChart(that, svgElement, chart, images) {
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
    } = that._drawSkeleton(svgElement, chart);
    gYAxis.call(that._drawHorizontalYAxis, chart);
    gTitle.call(that._drawTitle, chart);
    gSubtitle.call(that._drawSubtitle, chart);
    gGraph
      .selectAll("rect")
      .data(chart.data, chart.dataKey)
      .enter()
      .append("rect")
      .attr("class", "graphRect")
      .attr("fill", d => chart.z(d[chart.xLabel]))
      .call(this._applyFocus, chart)
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("width", d => chart.x0(d[chart.xLabel]))
      .attr("height", chart.yScale.bandwidth());
    gGraph
      .selectAll("text")
      .data(chart.data, chart.dataKey)
      .enter()
      .append("text")
      .attr("class", "graphText")
      .attr("font-size", chart.fontsize_graphText + "px")
      .attr("fill", chart.fontcolor_graphText)
      .attr("x", d => chart.x0(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("dx", "0.4em")
      .attr("dy", chart.yScale.bandwidth() / 2)
      .attr("alignment-baseline", "middle")
      .text((d, i) => {
        let label = +d[chart.xLabel];
        if (chart.label) {
          chart.label.forEach(l => {
            if (l.row === i + 1) {
              label = l.comment;
            }
          });
        }
        return label;
      });
    // .text(d => +d[chart.xLabel]);
    gLegend.call(that._drawLegend, chart);
    gReference.call(that._drawReference, chart);
    gMadeBy.call(that._drawMadeBy, chart);
    if (images) {
      images.forEach(image => {
        that._drawImage(gImage, image, chart);
      });
    }
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

  _applyTransition(that, canvas, chart) {
    canvas.gYAxis
      .transition()
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      .ease(chart.easing)
      .call(that._drawHorizontalYAxis, chart);
    // Update selection
    let rect = canvas.gGraph
      .selectAll("rect.graphRect")
      .data(chart.data, chart.dataKey)
      .attr("fill", d => chart.z(d[chart.xLabel]));
    rect
      .exit() // Exit selection
      .transition()
      .duration(chart.duration / 2)
      .delay(chart.accumedDelay)
      .style("opacity", 0)
      .attr("height", 0)
      .attr("x", 0)
      .remove();
    rect
      .enter() // Enter selection
      .append("rect")
      .attr("class", "graphRect")
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("fill", chart.colorToFocus)
      .merge(rect) // Enter + Update selection
      .transition()
      .ease(chart.easing)
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      // .attr("fill", chart.color)
      // .call(this._applyFocus, chart) // apply focus
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("width", d => chart.x0(d[chart.xLabel]))
      .attr("height", chart.yScale.bandwidth());

    let text = canvas.gGraph
      .selectAll("text.graphText")
      .data(chart.data, chart.dataKey);
    text
      .exit()
      .transition()
      .duration(chart.duration / 2)
      .delay(chart.accumedDelay)
      // .attr("height", 0)
      .attr("x", 0)
      .style("opacity", 0)
      .remove();
    text
      .enter()
      .append("text")
      .attr("class", "graphText")
      // .attr("x", d => chart.x0(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("opacity", 0)
      // .attr("y", d => chart.yScale(d[chart.yLabel]))
      .merge(text)
      .transition()
      .ease(chart.easing)
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      // .delay(chart.accumedDelay)
      .attr("font-size", chart.fontsize_graphText + "px")
      .attr("fill", chart.fontcolor_graphText)
      .attr("x", d => chart.x0(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("dx", "0.4em")
      .attr("dy", chart.yScale.bandwidth() / 2)
      .attr("alignment-baseline", "middle")
      .attr("opacity", 1)
      .text((d, i) => {
        let label = +d[chart.xLabel];
        if (chart.label) {
          chart.label.forEach(l => {
            if (l.row === i + 1) {
              label = l.comment;
            }
          });
        }
        return label;
      });
  }
  _drawLegend(g, chart) {
    if (!chart.unit) return;
    let legend = g
      // .attr("font-family", "sans-serif")
      // .attr("text-anchor", "end")
      .append("g");
    legend
      .append("text")
      .attr("font-size", chart.fontsize_unit)
      // .attr("y", 9.5)
      // .attr("dx", -5)
      // .attr("dy", "0.32em")
      .attr("fill", chart.theme.colorPrimary)
      .text(function(d) {
        return `단위: ${chart.unit}`;
      });
  }
}
