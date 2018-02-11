import * as d3 from "d3";

export default class BarFactory {
  renderChart() {
    const renderer = (svgElement, chart) => {
      this._drawChart(this, svgElement, chart);
    };
    return renderer;
  }

  renderTransition() {
    const renderer = (svgElement, charts) => {
      let g = this._drawChart(this, svgElement, charts[0]);
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
    gif.on("progress", function(p) {
      gifToPresent.text(d3.format("%")(p) + " rendered");
    });
    gif.on("finished", function(blob) {
      gifToPresent
        .text("")
        .append("img")
        .attr("src", URL.createObjectURL(blob));
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
      let g = this._drawChart(this, svgElement, cht0);
      cht1.accumedDelay = cht1.delay;
      g.call(this._applyTransition, this, cht1);

      const allElements = g.selectAll("*");
      const tweeners = this._getAllTweeners(g);
      const totalDuration = cht1.accumedDelay + cht1.duration;
      allElements.interrupt();
      const frames = 30 * totalDuration / 1000;

      let promises = [];
      d3.range(frames).forEach(function(f, i) {
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
          // .selectAll("*:not(.classname)")
          .remove();
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

  _getAllTweeners(g) {
    let tweeners = [];
    const allElements = g.selectAll("*");
    allElements.each(function(d, i) {
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
      pending.forEach(function(tran, i) {
        if (tran.tween.length === 0) return;
        var ease = tran.ease || (d => d);
        tran.tween.forEach(function(tween) {
          const tweener = (tween.value.call(node, d, i) || (() => {})).bind(
            node
          );
          (function(idx) {
            tweeners.push(function(t) {
              if (t >= tran.delay && t < tran.delay + tran.duration) {
                const relativeTime = (t - tran.delay) / tran.duration;
                tweener(ease(relativeTime));
              }
            });
          })(i);
        });
      });
    });
    return tweeners;
  }

  _drawChart(that, svgElement, chart) {
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
      .call(chart.customXAxis);
    return g;
  }

  _applyTransition(g, that, chart) {
    g
      .select(".x.axis")
      .transition()
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      .call(chart.customXAxis);
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
      .ease(chart.easing)
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      .attr("fill", chart.color)
      .call(that._applyFocus, chart) // apply focus
      .attr("x", d => chart.xScale(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("width", chart.xScale.bandwidth())
      .attr("height", d => chart.height_g - chart.yScale(d[chart.yLabel]));
  }

  _applyFocus(rect, chart) {
    if (chart.focusType !== "") {
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

  _drawPathRect(g, chart, isHide) {
    g
      .attr("d", (d, i) => {
        return rounded_rect(
          chart.xScale(d[chart.xLabel]),
          chart.yScale(d[chart.yLabel]),
          chart.xScale.bandwidth(),
          chart.height_g - chart.yScale(d[chart.yLabel]),
          chart.radius,
          !isHide,
          !isHide,
          false,
          false
        );
      })
      .style("fill", chart.color);

    function rounded_rect(x, y, w, h, r, tl, tr, bl, br) {
      var retval;
      retval = "M" + (x + r) + "," + y;
      retval += "h" + (w - 2 * r);
      if (tr) {
        retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r;
      } else {
        retval += "h" + r;
        retval += "v" + r;
      }
      retval += "v" + (h - 2 * r);
      if (br) {
        retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r;
      } else {
        retval += "v" + r;
        retval += "h" + -r;
      }
      retval += "h" + (2 * r - w);
      if (bl) {
        retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r;
      } else {
        retval += "h" + -r;
        retval += "v" + -r;
      }
      retval += "v" + (2 * r - h);
      if (tl) {
        retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;
      } else {
        retval += "v" + -r;
        retval += "h" + r;
      }
      retval += "z";
      return retval;
    }
  }
}
