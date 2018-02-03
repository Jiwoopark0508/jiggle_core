import * as d3 from "d3";
import makeGIF from "../../gif/makeGIF";
// import recordTransition from "../../gif/d3-record";

export default class BarFactory {
  renderChart() {
    const renderer = (svgElement, chart) => {
      this._drawChart(svgElement, chart);
    };
    return renderer;
  }

  renderTransition() {
    const renderer = (svgElement, charts) => {
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

  recordTransition(svgElement, charts) {
    if (charts.length === 0) return;
    let gif = new window.GIF({
      workers: 1,
      quality: 10,
      repeat: 0
    });
    const gifToPresent = d3.select("#gif");
    // console.log(gifToPresent);
    gif.on("progress", function(p) {
      gifToPresent.text(d3.format("%")(p) + " rendered");
    });
    gif.on("finished", function(blob) {
      gifToPresent
        .text("")
        .append("img")
        .attr("src", URL.createObjectURL(blob));
      // d3.timer(jumpToTime);
    });
    let chain = Promise.resolve();
    charts.forEach((cht, i) => {
      if (i < 1) return;
      let cht0 = charts[i - 1];
      let cht1 = charts[i];
      chain = chain.then(() =>
        this._recordSingleTransition(gif, svgElement, cht0, cht1)
      );
    });
    chain.then(() => gif.render());
  }

  _recordSingleTransition(gif, svgElement, cht0, cht1) {
    return new Promise((resolve0, reject) => {
      let g = this._drawChart(svgElement, cht0);
      cht1.accumedDelay = cht1.delay;
      g.call(this._applyTransition, this, cht1);

      const allElements = g.selectAll("*");
      const tweeners = this._getAllTweeners(g);
      const totalDuration = cht1.accumedDelay + cht1.duration;
      allElements.interrupt();
      console.log(totalDuration);
      const frames = 20 * totalDuration / 1000;

      let promises = [];
      d3.range(frames).forEach(function(f, i) {
        // if (i === 0) return; // skip white background
        promises.push(
          new Promise(function(resolve1, reject) {
            addFrame((f + 1) / frames * totalDuration, resolve1);
          })
        );
      });

      Promise.all(promises).then(function(results) {
        d3
          .select(svgElement)
          .selectAll("*")
          .remove();

        resolve0();
      });

      function jumpToTime(t) {
        tweeners.forEach(function(tween) {
          // console.log(tween);
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
          // console.log(chart.duration / frames);
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

  _getAllTweeners(g) {
    // console.log("getAllTweeners called.");
    let tweeners = [];
    const allElements = g.selectAll("*");
    // console.log(allElements);

    allElements.each(function(d, i) {
      const node = this;
      // node: rect, axis, etc.
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
      pending.forEach(function(tran, i) {
        // console.log(tran);
        // tran: rect, axis, etc.
        if (tran.tween.length === 0) return;
        var ease = tran.ease || (d => d);
        tran.tween.forEach(function(tween) {
          // tween: fill, opacity, x, y, width, height, etc.
          // console.log(node);
          // console.log(tween.value);
          const tweener = (tween.value.call(node, d, i) || (() => {})).bind(
            node
          );
          (function(idx) {
            tweeners.push(function(t) {
              // if (true) {
              //   t = relativeTime(t, tran.duration, tran.accumedDelay);
              // }
              // console.log(tran.delay, tran.duration);
              if (t >= tran.delay && t < tran.delay + tran.duration) {
                // if (true) {
                const relativeTime = (t - tran.delay) / tran.duration;
                // console.log(t);
                // console.log(tran);
                // console.log(node);
                // console.dir(tweener);
                // console.log(relativeTime);
                tweener(ease(relativeTime));
                // console.log(ease(t));
                // tweener(ease(t));
              }
            });
          })(i);
        });
        // console.log("-----");
      });
    });

    function relativeTime(ms, duration, delay) {
      return Math.min(1, Math.max(0, (ms - delay) / duration));
    }

    return tweeners;
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
      .attr("fill", chart.color)
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
      .duration(chart.duration)
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
