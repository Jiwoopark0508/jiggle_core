import * as d3 from "d3";
import { drawSkeleton, getAllTweeners, drawXLine } from "./common-factory";
import { getImageUrlFromBase64 } from "../common/utils";

export default class BarFactory {
  renderChart() {
    const renderer = (svgElement, chart, images) => {
      const canvas = this._drawChart(this, svgElement, chart, images);
      return canvas.gTotal;
    };
    return renderer;
  }

  renderTransition() {
    const renderer = (svgElement, charts, images) => {
      // let canvas = this._drawBI(this, svgElement, charts[0]);
      const canvas = this._drawChart(this, svgElement, charts[0], images);
      charts.forEach((cht, i) => {
        if (i === 0) return;

        cht.accumedDelay =
          cht.delay + charts[i - 1].duration + charts[i - 1].accumedDelay;
        this._applyTransition(this, canvas, cht);

        // if (i === 0) {
        //   cht.accumedDelay = cht.delay;
        // } else {
        //   cht.accumedDelay =
        //     cht.delay + charts[i - 1].duration + charts[i - 1].accumedDelay;
        // }
        // this._applyTransition(this, canvas, cht);
      });
    };
    return renderer;
  }

  recordTransition(svgElement, charts, onProcess, onFinished, images) {
    if (charts.length === 0) return;
    let gif = new window.GIF({
      workers: 1,
      quality: 10,
      repeat: 0
    });
    gif.on("progress", function(p) {
      onProcess(p);
    });
    gif.on("finished", function(blob) {
      onFinished(blob);
    });
    let chain = Promise.resolve();
    charts.forEach((cht, i) => {
      // let cht0, cht1;
      // if (i === 0) {
      //   cht0 = "BI";
      //   cht1 = charts[i];
      // } else {
      //   cht0 = charts[i - 1];
      //   cht1 = charts[i];
      // }
      if (i === 0) return;
      const cht0 = charts[i - 1];
      const cht1 = charts[i];
      if (i === charts.length - 1) cht1.isLastChart = true;
      chain = chain.then(() =>
        this._recordSingleTransition(gif, svgElement, cht0, cht1, images)
      );
    });
    chain.then(() => gif.render());
  }

  _recordSingleTransition(gif, svgElement, cht0, cht1, images) {
    return new Promise((resolve0, reject) => {
      let canvas;
      if (cht0 === "BI") {
        canvas = this._drawBI(this, svgElement, cht1);
      } else {
        canvas = this._drawChart(this, svgElement, cht0, images);
        // g = canvas.gTotal;
      }
      const g = canvas.gTotal;
      cht1.accumedDelay = cht1.delay;
      this._applyTransition(this, canvas, cht1);

      const allElements = g.selectAll("*");
      const tweeners = getAllTweeners(g);
      const totalDuration = cht1.accumedDelay + cht1.duration;
      allElements.interrupt();
      const frames = 30 * totalDuration / 1000;

      let promises = [];
      d3.range(frames).forEach(function(f, i) {
        promises.push(
          new Promise(function(resolve1, reject) {
            addFrame(f / frames * totalDuration, resolve1);
          })
        );
      });

      if (cht1.isLastChart) {
        const lastSceneFrames = (cht1.lastFor || 2000) / 1000 * 30;
        d3.range(lastSceneFrames).forEach(function(f, i) {
          promises.push(
            new Promise(function(resolve1, reject) {
              addFrame(totalDuration, resolve1);
            })
          );
        });
      }

      Promise.all(promises).then(function(results) {
        resolve0();
      });

      function jumpToTime(t) {
        tweeners.forEach(function(tween) {
          tween(t);
        });
      }

      function addFrame(t, resolve1) {
        jumpToTime(t);
        let img = new Image(),
          serialized = new XMLSerializer().serializeToString(svgElement),
          blob = new Blob([serialized], { type: "image/svg+xml" }),
          url = URL.createObjectURL(blob);
        img.onload = function() {
          gif.addFrame(img, {
            delay: totalDuration / frames,
            copy: true
          });
          resolve1();
        };
        img.src = url;
      }
    });
  }

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
    } = drawSkeleton(svgElement, chart);
    gYAxis.call(chart.customYAxis);
    gXAxis.call(chart.customXAxis);
    gXAxis.call(drawXLine, chart);
    // gTitle
    //   .append("text")
    //   .attr("class", "titleText")
    //   .attr("font-size", chart.fontsize_title + "px")
    //   .attr("font-style", chart.fontstyle_title)
    //   .attr("fill", chart.fontcolor_title)
    //   .text(chart.title);
    gTitle.call(chart.drawTitle);
    gSubtitle
      .append("text")
      .attr("class", "subtitleText")
      .attr("font-size", chart.fontsize_subtitle + "px")
      .attr("fill", chart.fontcolor_subtitle)
      .text(chart.subtitle);
    gGraph
      .selectAll("rect")
      .data(chart.data, chart.dataKey)
      .enter()
      .append("rect")
      .attr("class", "graphRect")
      .attr("fill", chart.color)
      .call(this._applyFocus, chart)
      .attr("x", d => chart.xScale(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("width", chart.xScale.bandwidth())
      .attr("height", d => chart.height_g_body - chart.yScale(d[chart.yLabel]));
    gGraph
      .selectAll("text")
      .data(chart.data, chart.dataKey)
      .enter()
      .append("text")
      .attr("class", "graphText")
      .attr("font-size", chart.fontsize_graphText + "px")
      .attr("fill", chart.fontcolor_graphText)
      .attr("x", d => chart.xScale(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("dx", chart.xScale.bandwidth() / 2)
      .attr("dy", "-0.5em")
      .attr("text-anchor", "middle")
      .text(d => +d[chart.yLabel]);
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

    images &&
      images.forEach((image, index) => {
        gImage
          .append("svg:image")
          .attr("xlink:href", `data:${image.mimeType};base64, ${image.base64}`)
          .attr("x", image.x)
          .attr("y", image.y)
          .attr("width", image.width)
          .attr("height", image.height);
      });
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

  _drawBI(that, svgElement, chart) {
    const canvas = drawSkeleton(svgElement, chart);
    canvas.gXAxis.call(chart.BILine);
    return canvas;
  }

  _applyTransition(that, canvas, chart) {
    canvas.gYAxis
      .transition()
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      // .delay(chart.accumedDelay)
      .call(chart.customYAxis);
    canvas.gXAxis
      .transition()
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      // .delay(chart.accumedDelay)
      .call(chart.customXAxis);
    // Update selection
    let rect = canvas.gGraph
      .selectAll("rect.graphRect")
      .data(chart.data, chart.dataKey)
      .attr("fill", chart.color);
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
      .attr("x", d => chart.xScale(d[chart.xLabel]))
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
      .attr("x", d => chart.xScale(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("width", chart.xScale.bandwidth())
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
      .attr("x", d => chart.xScale(d[chart.xLabel]))
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
      .attr("x", d => chart.xScale(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("dx", chart.xScale.bandwidth() / 2)
      .attr("dy", "-0.5em")
      .attr("text-anchor", "middle")
      .attr("opacity", 1)
      .text(d => +d[chart.yLabel]);
  }

  _applyFocus(rect, chart) {
    if (chart.indexToFocus) {
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
}
