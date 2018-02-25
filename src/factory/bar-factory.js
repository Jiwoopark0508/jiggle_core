// import * as d3 from "d3";
import CommonFactory from "./common-factory";
// import { getImageUrlFromBase64 } from "../common/utils";

export default class BarFactory extends CommonFactory {
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
    gYAxis.call(that._drawVerticalYAxis, chart);
    gYAxis.call(that._drawYLine, chart);
    gBackground.call(that._drawBackground, chart);
    gXAxis.call(that._drawVerticalXAxis, chart);
    gXAxis.call(that._drawXLine, chart);
    gTitle.call(that._drawTitle, chart);
    gSubtitle.call(that._drawSubtitle, chart);
    // console.log(chart.colorToFocus);
    gGraph
      .selectAll("rect")
      .data(chart.data, chart.dataKey)
      .enter()
      .append("rect")
      .attr("class", "graphRect")
      .attr("fill", d => chart.z(d[chart.xLabel]))
      .call(this._applyFocus, chart)
      .attr("x", d => chart.x0(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("width", chart.x0.bandwidth())
      .attr("height", d => chart.height_g_body - chart.yScale(d[chart.yLabel]));
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
      .attr("dx", chart.x0.bandwidth() / 2)
      .attr("dy", "-0.5em")
      .attr("text-anchor", "middle")
      .text((d, i) => {
        let label = +d[chart.yLabel];
        if (chart.label) {
          chart.label.forEach(l => {
            if (l.row === i + 1) {
              label = l.comment;
            }
          });
        }
        return label;
      });
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
      // .delay(chart.accumedDelay)
      .call(that._drawVerticalYAxis, chart);
    canvas.gXAxis
      .transition()
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      // .delay(chart.accumedDelay)
      .call(that._drawVerticalXAxis, chart);
    canvas.gBackground
      .transition()
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      .call(that._drawBackground, chart);
    // Update selection
    let rect = canvas.gGraph
      .selectAll("rect.graphRect")
      .data(chart.data, chart.dataKey)
      // .attr("fill", chart.color);
      .attr("fill", d => chart.z(d[chart.xLabel]));
    rect
      .exit() // Exit selection
      .transition()
      .duration(chart.duration / 2)
      .delay(chart.accumedDelay)
      .style("opacity", 0)
      .attr("height", 0)
      .attr("y", chart.height_g_body)
      .remove();
    rect
      .enter() // Enter selection
      .append("rect")
      .attr("class", "graphRect")
      .attr("x", d => chart.x0(d[chart.xLabel]))
      .attr("y", d => chart.height_g_body)
      .attr("fill", chart.colorToFocus)
      .merge(rect) // Enter + Update selection
      .transition()
      .ease(chart.easing)
      .duration(chart.duration)
      // .delay(chart.accumedDelay)
      .delay(chart[chart.delayType])
      // .attr("fill", chart.color)
      // .call(this._applyFocus, chart) // apply focus
      .attr("x", d => chart.x0(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("width", chart.x0.bandwidth())
      .attr("height", d => chart.height_g_body - chart.yScale(d[chart.yLabel]));

    let text = canvas.gGraph
      .selectAll("text.graphText")
      .data(chart.data, chart.dataKey);
    text
      .exit()
      .transition()
      .duration(chart.duration / 2)
      .delay(chart.accumedDelay)
      .attr("height", 0)
      .attr("y", chart.height_g_body)
      .style("opacity", 0)
      .remove();
    text
      .enter()
      .append("text")
      .attr("class", "graphText")
      .attr("x", d => chart.x0(d[chart.xLabel]))
      .attr("y", chart.height_g_body)
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
      .attr("dx", chart.x0.bandwidth() / 2)
      .attr("dy", "-0.5em")
      .attr("text-anchor", "middle")
      .attr("opacity", 1)
      .text((d, i) => {
        let label = +d[chart.yLabel];
        if (chart.label) {
          chart.label.forEach(l => {
            if (l.row === i + 1) {
              label = l.comment;
            }
          });
        }
        return label;
      });
    // .text(d => +d[chart.yLabel]);
  }
  _drawLegend(g, chart) {
    if (!chart.unit) return;
    let legend = g
      // .attr("font-family", "sans-serif")
      .attr("text-anchor", "end")
      // .selectAll("g")
      // .data(chart.keys)
      // .enter()
      .append("g");
    // .attr("transform", function(d, i) {
    //   return "translate(0," + i * 20 + ")";
    // });
    // legend
    //   .append("rect")
    //   .attr("width", 19)
    //   .attr("height", 19)
    //   .attr("fill", chart.z);
    legend
      .append("text")
      .attr("font-size", 15)
      // .attr("x", chart.width_g_body - 24)
      .attr("y", 9.5)
      .attr("dx", -5)
      .attr("dy", "0.32em")
      .attr("fill", chart.theme.colorPrimary)
      .text(function(d) {
        return `단위: ${chart.unit}`;
        // return d;
      });
  }
}
