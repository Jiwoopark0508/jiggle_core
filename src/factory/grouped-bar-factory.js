// import * as d3 from "d3";
import CommonFactory from "./common-factory";

export default class GroupedBarFactory extends CommonFactory {
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
    graphRect
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

  _drawLegend(g, chart) {
    // let unit = g
    //   .append("text")
    //   .attr("");

    // g.append("text").text(chart.unit);
    if (chart.unit !== undefined) {
      g
        .attr("text-anchor", "end")
        .append("text")
        .style("font-size", 13)
        .attr("dx", 18)
        .attr("dy", 12)
        .attr("fill", chart.theme.colorPrimary)
        .style("font-weight", 700)
        .text(`단위: ${chart.unit}`);
    }

    let legend = g
      // .attr("font-family", "sans-serif")
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(chart.keys)
      // .data(chart.keys.slice().reverse())
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + (i + 1) * 20 + ")";
      });
    legend
      .append("rect")
      // .attr("x", chart.width_g_body - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", chart.z);
    legend
      .append("text")
      .style("font-size", 13)
      // .attr("x", chart.width_g_body - 24)
      .attr("y", 9.5)
      .attr("dx", -5)
      .attr("dy", "0.32em")
      .attr("fill", chart.theme.colorPrimary)
      .text(function(d) {
        return d;
      });
  }
}
