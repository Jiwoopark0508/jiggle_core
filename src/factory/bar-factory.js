import * as d3 from "d3";

export default class BarFactory {
  renderChart() {
    const renderer = (svgElement, chart) => {
      return this._drawChart(this, svgElement, chart);
    };
    return renderer;
  }

  renderTransition() {
    const renderer = (svgElement, charts) => {
      // let g = this._drawChart(this, svgElement, charts[0]);
      let g = this._drawBI(this, svgElement, charts[0]);
      charts.forEach((cht, i) => {
        if (i === 0) {
          cht.accumedDelay = cht.delay;
        } else {
          cht.accumedDelay =
            cht.delay + charts[i - 1].duration + charts[i - 1].accumedDelay;
        }
        g.call(this._applyTransition, this, cht);
      });
    };
    return renderer;
  }

  recordTransition(svgElement, charts, onProcess, onFinished) {
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
      let cht0, cht1;
      if (i === 0) {
        cht0 = "BI";
        cht1 = charts[i];
      } else {
        cht0 = charts[i - 1];
        cht1 = charts[i];
      }
      if (i === charts.length - 1) cht1.isLastChart = true;
      chain = chain.then(() =>
        this._recordSingleTransition(gif, svgElement, cht0, cht1)
      );
    });
    chain.then(() => gif.render());
  }

  getChildG(gParent) {
    const layers = [
      "total",
      "body",
      "footer",
      "title",
      "legend",
      "background",
      "axis",
      "graph",
      "legend",
      "reference"
    ];
    const childNodes = gParent.selectAll("g").nodes();
    const result = childNodes.reduce((acc, child) => {
      const childSelection = d3.select(child);
      const className = childSelection.attr("class");
      layers.forEach((l, i) => {
        if (className.includes(l)) {
          // console.log(`${className} includes ${l}`);
          if (!acc[l]) acc[l] = child;
          else {
            acc[l] = [child].concat(acc[l]);
          }
        }
      });
      return acc;
    }, {});

    return result;
  }

  _recordSingleTransition(gif, svgElement, cht0, cht1) {
    return new Promise((resolve0, reject) => {
      let g;
      if (cht0 === "BI") {
        g = this._drawBI(this, svgElement, cht1);
      } else {
        g = this._drawChart(this, svgElement, cht0);
      }
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

  _drawBI(that, svgElement, chart) {
    let { gTotal, gXAxis } = that._drawSkeleton(svgElement, chart);
    gXAxis
      .append("path")
      // .attr("transform", `translate(0, ${chart.height_g_body})`)
      .call(chart.BILine);
    return gTotal;
  }

  _drawSkeleton(svgElement, chart) {
    let svg = d3.select(svgElement);
    svg.selectAll("*").remove();
    svg
      .attr("width", chart.width_svg)
      .attr("height", chart.height_svg)
      .style("background-color", chart.backgroundColor);
    let gTotal = svg
      .append("g")
      .attr("class", "total")
      .attr("transform", `translate(${chart.x_g_total}, ${chart.y_g_total})`);
    let gHeader = gTotal.append("g").attr("class", "header");
    let gBody = gTotal
      .append("g")
      .attr("class", "body")
      .attr("transform", `translate(${chart.x_g_body}, ${chart.y_g_body})`);
    let gFooter = gTotal
      .append("g")
      .attr("class", "footer")
      .attr("transform", `translate(0, ${chart.y_g_footer})`);

    let gTitleBox = gHeader.append("g").attr("class", "titleBox");
    let gLegend = gHeader
      .append("g")
      .attr("class", "legendBox")
      .attr("transform", `translate(${chart.width_g_total}, 0)`)
      .style("text-anchor", "end");

    let gBackground = gBody.append("g").attr("class", "background");
    let gXAxis = gBody
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${chart.y_g_xAxis})`);
    let gYAxis = gBody.append("g").attr("class", "y axis");
    let gGraph = gBody.append("g").attr("class", "graph");

    let gReferenceBox = gFooter
      .append("g")
      .attr("class", "referenceBox")
      .attr("transform", `translate(0, ${chart.y_g_referenceBox})`);

    let gTitle = gTitleBox
      .append("g")
      .attr("class", "titleG")
      .attr("transform", `translate(0, ${chart.fontsize_title})`);
    let gSubtitle = gTitleBox
      .append("g")
      .attr("class", "subtitleG")
      .attr("transform", `translate(0, ${chart.y_g_subtitle})`);

    let gReference = gReferenceBox.append("g").attr("class", "reference");
    let gMadeBy = gReferenceBox
      .append("g")
      .attr("class", "madeBy")
      .attr("transform", `translate(0, ${chart.y_g_madeBy})`);

    return {
      svg,
      gTotal,
      gHeader,
      gBody,
      gFooter,
      gTitleBox,
      gLegend,
      gBackground,
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
      gXAxis,
      gYAxis,
      gGraph,
      gReferenceBox,
      gTitle,
      gSubtitle,
      gReference,
      gMadeBy
    } = that._drawSkeleton(svgElement, chart);
    gYAxis.call(chart.customYAxis);
    gXAxis.call(chart.customXAxis);
    gTitle
      .append("text")
      .attr("class", "titleText")
      .attr("font-size", chart.fontsize_title + "px")
      .attr("font-style", chart.fontstyle_title)
      .attr("fill", chart.fontcolor_title)
      .text(chart.title);
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
      .attr("fill", chart.color)
      .call(this._applyFocus, chart)
      .attr("x", d => chart.xScale(d[chart.xLabel]))
      .attr("y", d => chart.yScale(d[chart.yLabel]))
      .attr("width", chart.xScale.bandwidth())
      .attr("height", d => chart.height_g_body - chart.yScale(d[chart.yLabel]));
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
    return gTotal;
  }

  _applyTransition(g, that, chart) {
    g
      .select(".y.axis")
      .transition()
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      .call(chart.customYAxis);
    g
      .select(".x.axis")
      .transition()
      .duration(chart.duration)
      .delay(chart[chart.delayType])
      .call(chart.customXAxis);
    // Update selection
    let rect = g
      .select(".body")
      .selectAll("rect")
      .data(chart.data, chart.dataKey);
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
      .attr("y", d => chart.height_g_body)
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
      .attr("height", d => chart.height_g_body - chart.yScale(d[chart.yLabel]));
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
}
