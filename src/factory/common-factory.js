import * as d3 from "d3";

export default class CommonFactory {
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
      const tweeners = this._getAllTweeners(g);
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

  _drawXLine(g, chart) {
    g.selectAll("path.BI").remove();
    let path = g.append("path").attr("class", "BI");
    const data = d3.range(2);
    const lineXScale = d3
      .scaleLinear()
      .domain(data)
      .range([0, chart.width_g_body]);
    const lineYScale = d3
      .scaleLinear()
      .domain(data)
      .range([0, 0]);
    let line = d3
      .line()
      .curve(d3.curveLinear)
      .x(function(d, i) {
        return lineXScale(i);
      })
      .y(function(d) {
        return lineYScale(d);
      });
    path
      .attr("d", line(data))
      // .attr("stroke", chart.colorBI)
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .attr("fill", "none");
    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", 0);
  }

  _drawYLine(g, chart) {
    g.selectAll("path.BI").remove();
    let path = g.append("path").attr("class", "BI");
    const data = d3.range(2);
    const lineXScale = d3
      .scaleLinear()
      .domain(data)
      .range([0, 0]);
    const lineYScale = d3
      .scaleLinear()
      .domain(data)
      .range([0, chart.height_g_body]);
    let line = d3
      .line()
      .curve(d3.curveLinear)
      .x(function(d, i) {
        return lineXScale(i);
      })
      .y(function(d) {
        return lineYScale(d);
      });
    path
      .attr("d", line(data))
      // .attr("stroke", chart.colorBI)
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .attr("fill", "none");
    const totalLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", 0);
  }

  _drawVerticalYAxis(g, chart) {
    const yAxis = d3
      .axisLeft(chart.yScale)
      .ticks(chart.numOfYAxisTicks)
      // .ticks(chart.numOfYAxisTicks, "s")
      .tickSize(-chart.width_g_body);
    g
      .call(yAxis)
      .selectAll(".domain, .tick line")
      .style("display", "none");
    g
      .selectAll(".tick text")
      .attr("font-size", chart.fontsize_yAxis + "px")
      .attr("fill", chart.fontcolor_tickText)
      .attr("dx", -2);
  }

  _drawVerticalXAxis(g, chart) {
    const xAxis = d3.axisBottom(chart.x0);
    g
      .call(xAxis)
      .selectAll(".domain, line")
      .style("display", "none");
    g
      .selectAll(".tick text")
      .attr("font-size", chart.fontsize_xAxis + "px")
      .attr("fill", chart.fontcolor_tickText);
  }

  _drawHorizontalYAxis(g, chart) {
    g
      .call(d3.axisLeft(chart.yScale))
      .selectAll(".domain,line")
      .style("display", "none");
    g
      .selectAll(".tick text")
      .attr("font-size", chart.fontsize_yAxis + "px")
      .attr("fill", chart.fontcolor_tickText);
  }

  _drawHorizontalXAxis(g, chart) {}

  _drawBackground(g, chart) {
    const yAxis = d3
      .axisLeft(chart.yScale)
      .ticks(chart.numOfYAxisTicks)
      .tickSize(-chart.width_g_body)
      .tickFormat(d => d);
    g
      .call(yAxis)
      .selectAll(".domain, .tick text")
      .style("display", "none");
    g
      .selectAll(".tick line")
      .attr("stroke-width", `${chart.tickDistance}`)
      .attr("stroke", function(d, i) {
        if (i === chart.arrLen - 1) return null;
        let colorStripe;
        colorStripe = i % 2 === 0 ? chart.colorStripe2 : chart.colorStripe1;
        // console.log(i, d, this, colorStripe);
        return colorStripe;
      })
      .attr("transform", `translate(0,${-chart.tickDistance / 2})`);
  }

  _drawTitle(g, chart) {
    let s = g.selection ? g.selection() : g;
    s
      .append("text")
      .attr("class", "titleText")
      .attr("font-size", chart.fontsize_title + "px")
      .attr("fill", chart.fontcolor_title)
      .text(chart.title);
  }

  _drawSubtitle(g, chart) {
    g
      .append("text")
      .attr("class", "subtitleText")
      .attr("font-size", chart.fontsize_subtitle + "px")
      .attr("fill", chart.fontcolor_subtitle)
      .text(chart.subtitle);
  }

  _drawReference(g, chart) {
    g
      .append("text")
      .attr("class", "referenceText")
      .attr("font-size", chart.fontsize_reference + "px")
      .attr("fill", chart.fontcolor_reference)
      .text(`자료 출처: ${chart.reference}`);
  }

  _drawMadeBy(g, chart) {
    g
      .append("text")
      .attr("class", "madeByText")
      .attr("font-size", chart.fontsize_madeBy + "px")
      .attr("fill", chart.fontcolor_madeBy)
      .text(`만든이: ${chart.madeBy}`);
  }

  _drawImage(g, image, chart) {
    g
      .append("svg:image")
      .attr("xlink:href", image.href)
      .attr("x", image.x - chart.x_g_body - chart.x_g_total)
      .attr("y", image.y - chart.y_g_body - chart.y_g_total)
      .attr("width", image.width)
      .attr("height", image.height);
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

  _drawSkeleton(svgElement, chart) {
    let svg = d3.select(svgElement);
    svg.selectAll("*").remove();
    // svg.selectAll("*:not(#images)").remove();
    svg
      .attr("width", chart.width_svg)
      .attr("height", chart.height_svg)
      .style("background-color", chart.backgroundColor)
      .style("user-select", "none")
      .style("font-family", chart.fontFamily);
    let gTotal = svg
      .append("g")
      .attr("class", "total")
      .attr("transform", `translate(${chart.x_g_total}, ${chart.y_g_total})`);
    let gBody = gTotal
      .append("g")
      .attr("class", "body")
      .attr("transform", `translate(${chart.x_g_body}, ${chart.y_g_body})`);
    let gHeader = gTotal.append("g").attr("class", "header");
    let gFooter = gTotal
      .append("g")
      .attr("class", "footer")
      .attr("transform", `translate(0, ${chart.y_g_footer})`);

    let gTitleBox = gHeader.append("g").attr("class", "titleBox");
    let gLegend = gHeader
      .append("g")
      .attr("class", "legendBox")
      .attr("transform", `translate(${chart.x_g_legend}, 0)`)
      // .attr("transform", `translate(${chart.width_g_total}, 0)`)
      .style("text-anchor", "end");

    let gBackground = gBody.append("g").attr("class", "background");
    let gImage = gBody.append("g").attr("class", "imageG");
    let gYAxis = gBody.append("g").attr("class", "y axis");
    let gGraph = gBody.append("g").attr("class", "graph");
    let gXAxis = gBody
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${chart.y_g_xAxis})`);
    // if (chart.type && chart.type.includes("horizontal")) {
    //   gYAxis.remove();
    //   gYAxis = gGraph.append("g").attr("class", "y axis");
    // }

    let gReferenceBox = gFooter
      .append("g")
      .attr("class", "referenceBox")
      .attr("transform", `translate(0, ${chart.y_g_referenceBox})`);

    let gTitle = gTitleBox
      .append("g")
      .attr("class", "titleG")
      // .attr("transform", `translate(0, ${chart.fontsize_title})`)
      .style("font-weight", 700);
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
}
