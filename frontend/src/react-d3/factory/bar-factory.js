import * as d3 from "d3";
import makeGIF from "../../gif/makeGIF";
import recordTransition from "../../gif/d3-record";

// branch: gif
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
      let tweeners = [];
      let gif = new window.GIF({
        workers: 1,
        quality: 10,
        repeat: 0
      });
      let t = [];
      charts.forEach((cht, i) => {
        if (i !== 0) {
          cht.accumedDelay =
            cht.delay + charts[i - 1].duration + charts[i - 1].accumedDelay;
          g.call(this._applyTransition, this, cht);
          // this._recordTransition(svgElement, cht, g, frames, true);
          // if (i === 2) console.log(g.selectAll("*"));
          // t.push(
          //   this._recordTransition(
          //     svgElement,
          //     charts,
          //     g,
          //     gif,
          //     // frames,
          //     true
          //   )
          // ); // [{trans:[], tweeners:[]}, {trans:[], tweeners:[]}]
        }
      });
      // const allElements = g.selectAll("*");

      // allElements.interrupt();
      // console.log(t);
      // t.forEach(function(t1) {
      //   t1.forEach(function(t2) {
      //     t2(800);
      //   });
      // });

      // const totalDuration =
      //   charts[charts.length - 1].accumedDelay +
      //   charts[charts.length - 1].duration;
      // const frames = 20 * totalDuration / 1000;
      // let promises = [];

      // promises.push(
      //   new Promise((resolve0, reject) => {
      //     this._recordTransition(
      //       svgElement,
      //       charts,
      //       g,
      //       gif,
      //       frames,
      //       true,
      //       resolve0
      //     );
      //   })
      // );

      // Promise.all(promises).then(function(results) {
      //   // console.log(results);
      //   // console.log(results[0] === results[1]);
      //   results[0].render();
      // });
      // gif.on("progress", function(p) {
      //   // drawFrame(p * totalDuration);
      //   // d3.select("#gif").text(d3.format("%")(p) + " rendered");
      //   gifToPresent.text(d3.format("%")(p) + " rendered");
      // });

      // gif.on("finished", function(blob) {
      //   gifToPresent
      //     .text("")
      //     .append("img")
      //     .attr("src", URL.createObjectURL(blob));

      // d3.timer(drawFrame);
      // });
    };
    return renderer;
  }

  _recordTransition(
    svgElement,
    charts,
    selection,
    gif,
    // frames,
    realtime
    // resolve0
  ) {
    const tweeners = [];
    const allElements = selection.selectAll("*");

    // console.log(allChildren);
    allElements.each(function(d, i) {
      // console.log(this);
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
      // console.log(pending);
      const cumulativeSum = [pending[0].delay];
      for (var j = 1; j < pending.length; j++) {
        cumulativeSum[j] =
          cumulativeSum[j - 1] + pending[j].delay + pending[j].duration;
      }

      pending.forEach(function(tran, i) {
        if (tran.tween.length === 0) return;
        // console.log(tran.tween);
        // Probably unnecessary?
        var ease = tran.ease || (d => d);
        // console.log(transition);

        // console.log(tran);
        tran.tween.forEach(function(tween) {
          // Create a tweener with the tween function and the element's datum and index
          // Tweens with no change return false
          const tweener = (tween.value.call(node, d, i) || (() => {})).bind(
            node
          );

          // Function that calls the tweener with an eased time value
          (function(idx) {
            tweeners.push(function(t) {
              if (true) {
                t = relativeTime(t, tran.duration, cumulativeSum[idx]);
              }
              tweener(ease(t));
            });
          })(i);
        });
      });
    });

    allElements.interrupt();

    // return tweeners;

    // console.log(tweeners);
    // console.log(allChildren.nodes());
    // return tweeners;

    // allElements.interrupt();
    // jumpToTime(1000);
    // tweeners.forEach(function(tweener) {
    //   tweener(4800);
    // });

    // const gifToPresent = d3.select("#gif");

    // // let gif = new window.GIF({
    // //   workers: 1,
    // //   quality: 10,
    // //   repeat: 0
    // // });

    // const totalDuration =
    //   charts[charts.length - 1].accumedDelay +
    //   charts[charts.length - 1].duration;
    // gif.on("progress", function(p) {
    //   jumpToTime(p * totalDuration);
    //   // d3.select("#gif").text(d3.format("%")(p) + " rendered");
    //   gifToPresent.text(d3.format("%")(p) + " rendered");
    // });

    // gif.on("finished", function(blob) {
    //   gifToPresent
    //     .text("")
    //     .append("img")
    //     .attr("src", URL.createObjectURL(blob));
    //   d3.timer(jumpToTime);
    // });

    // let promises = [];
    // d3.range(frames).forEach(function(f) {
    //   // const t0 = f * chart.duration / (frames - 1) + chart.accumedDelay;
    //   // console.log(t0);
    //   promises.push(
    //     new Promise(function(resolve, reject) {
    //       addFrame(f / (frames - 1) * totalDuration, resolve);
    //     })
    //   );
    // });

    // console.log(tweeners);

    // Promise.all(promises).then(function(arrOfResults) {
    //   // svgToRender.style("display", "block");
    //   // gif.render();
    //   resolve0(gif);
    // });

    function relativeTime(ms, duration, delay) {
      return Math.min(1, Math.max(0, (ms - delay) / duration));
    }

    // function addFrame(t, resolve) {
    //   // console.log(svgElement);
    //   jumpToTime(t);
    //   var img = new Image(),
    //     serialized = new XMLSerializer().serializeToString(svgElement),
    //     // serialized = new XMLSerializer().serializeToString(svg.node()),
    //     blob = new Blob([serialized], { type: "image/svg+xml" }),
    //     url = URL.createObjectURL(blob);

    //   img.onload = function() {
    //     // console.log(chart.duration / frames);
    //     gif.addFrame(img, {
    //       delay: totalDuration / frames,
    //       copy: true
    //     });
    //     resolve();
    //   };
    //   img.src = url;
    // }

    function jumpToTime(t) {
      tweeners.forEach(function(tweener) {
        tweener(t);
      });
    }
  }

  _makeGIF(chart, jumpToTime, frames) {
    const gifToPresent = d3.select("#gif");

    let gif = new window.GIF({
      workers: 1,
      quality: 10,
      repeat: 0
    });

    gif.on("progress", function(p) {
      jumpToTime(p * chart.duration);
      // d3.select("#gif").text(d3.format("%")(p) + " rendered");
      gifToPresent.text(d3.format("%")(p) + " rendered");
    });

    gif.on("finished", function(blob) {
      gifToPresent
        .text("")
        .append("img")
        .attr("src", URL.createObjectURL(blob));
      d3.timer(jumpToTime);
    });

    let promises = [];
    d3.range(frames).forEach(function(f) {
      promises.push(
        new Promise(function(resolve, reject) {
          // addFrame(f * chart.duration / (frames - 1), resolve);
        })
      );
    });

    Promise.all(promises).then(function(arrOfResults) {
      // svgToRender.style("display", "block");
      gif.render();
    });
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
    // const transitions = [];
    // const tweeners = [];

    g
      .select(".x.axis")
      .transition()
      .duration(chart.duration)
      .delay(chart.accumedDelay)
      .call(d3.axisBottom(chart.xScale));
    // .call(that._recordTransition, transitions, tweeners, true);
    // Update selection
    let rect = g.selectAll("rect").data(chart.data, chart.dataKey);

    // console.log(rect);
    // let groupedG = g.selectAll("rect");
    // const jumpToTime = recordTransition(rect, true);

    let removingRect = rect
      .exit() // Exit selection
      .transition()
      .duration(chart.duration / 2)
      .delay(chart.accumedDelay)
      .style("opacity", 0)
      // .call(that._recordTransition, transitions, tweeners, true)
      .remove();

    // console.log(removingRect);
    // const jumpToTime = recordTransition(removingRect, true);
    // removingRect.remove();

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
    // .call(that._recordTransition, transitions, tweeners, true);

    // const jumpToTime = recordTransition(rect, true);
    // jumpToTime(800);
    // console.log(tweeners);
    // removingRect.selection().interrupt();
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
