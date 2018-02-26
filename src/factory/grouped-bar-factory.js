// import * as d3 from "d3";
import CommonFactory from "./common-factory";

export default class GroupedBarFactory extends CommonFactory {
  // renderTransition() {
  //   const renderer = (svgElement, charts, images) => {
  //     // let canvas = this._drawBI(this, svgElement, charts[0]);
  //     const canvas = this._drawChart(this, svgElement, charts[0], images);
  //       cht.accumedDelay =
  //         cht.delay + charts[i - 1].duration + charts[i - 1].accumedDelay;
  //       this._applyTransition(this, canvas, cht);
  //     });
  //   };
  //   return renderer;
  // }
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
    gXAxis.call(that._drawVerticalXAxis, chart);
    gBackground.call(that._drawBackground, chart);
    gYAxis.call(that._drawVerticalYAxis, chart);
    gTitle.call(that._drawTitle, chart);
    gXAxis.call(that._drawXLine, chart);
    gYAxis.call(that._drawYLine, chart);
    gSubtitle.call(that._drawSubtitle, chart);
    const graphG = gGraph
      .selectAll("g.graphG")
      .data(chart.data)
      .enter()
      .append("g")
      .attr("class", "graphG")
      .attr("transform", function(d) {
        return `translate(${chart.x0(d[chart.xLabel])},0)`;
      });
    graphG
      .selectAll("rect.graphRect")
      .data(function(d, i) {
        return chart.keys.map(function(key) {
          let result = {
            key,
            value: d[key]
          };
          if (chart.label) {
            const col = chart.keys.indexOf(key);
            chart.label.forEach(l => {
              if (l.row === i + 1 && l.col === col + 1) {
                result._label = l.comment;
              }
            });
          }
          return result;
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
        return chart.height_g_body - chart.yScale(d.value);
      })
      .attr("fill", function(d) {
        // console.log(d.key);
        const color = chart.z(d.key);
        // console.log(color);
        // console.log(chart.z.domain());
        return color;
        // return chart.z(d.key);
      });
    graphG
      .selectAll("text.graphText")
      .data(function(d, i) {
        return chart.keys.map(function(key) {
          let result = {
            key,
            value: d[key]
          };
          if (chart.label) {
            const col = chart.keys.indexOf(key);
            chart.label.forEach(l => {
              if (l.row === i + 1 && l.col === col + 1) {
                result._label = l.comment;
              }
            });
          }
          return result;
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
      .text((d, i) => {
        return d._label ? d._label : d.value;
      });

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
    console.log("called");
    const graphRect = canvas.gGraph
      .selectAll("g.graphRect")
      .transition()
      .duration(chart.duration)
      .delay(0)
      .attr("opacity", function(d, i) {
        d._label === undefined ? 0.3 : 1;
      });
  }

  _drawLegend(g, chart) {
    if (chart.unit !== undefined) {
      g
        .append("text")
        .style("font-size", chart.fontsize_unit)
        // .attr("dx", 18)
        // .attr("dy", 12)
        .attr("fill", chart.theme.colorPrimary)
        .style("font-weight", 700)
        .text(`단위: ${chart.unit}`);
    }

    const sizeRect = 12;
    let legend = g
      // .attr("font-family", "sans-serif")
      // .attr("text-anchor", "end")
      .selectAll("g")
      .data(chart.keys)
      // .data(chart.keys.slice().reverse())
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return `translate(${-sizeRect}, ${(i + 1) * (sizeRect + 5) + 7})`;
        // return "translate(0," + (i + 1) * (sizeRect + 2) + ")";
      });
    legend
      .append("rect")
      // .attr("x", chart.width_g_body - 19)
      .attr("y", -sizeRect + 1)
      .attr("width", sizeRect)
      .attr("height", sizeRect)
      .attr("fill", chart.z);
    legend
      .append("text")
      .style("font-size", chart.fontsize_unit * 0.8)
      // .attr("x", chart.width_g_body - 24)
      // .attr("y", 9.5)
      .attr("dx", -5)
      // .attr("dy", "0.32em")
      .attr("fill", chart.theme.colorPrimary)
      .text(function(d) {
        return d;
      });
  }
}
