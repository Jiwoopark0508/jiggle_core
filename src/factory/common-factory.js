import * as d3 from "d3";
import { axisLeft, axisBottom } from "../common/d3-axis";

export default class CommonFactory {
  renderChart() {
    const renderer = (svgElement, chart, images, isTransition, onFinished) => {
      const canvas = this._drawChart(
        this,
        svgElement,
        chart,
        images,
        isTransition
      );

      if (typeof onFinished === "function") {
        const serialized = new XMLSerializer().serializeToString(svgElement);
        // const serialized = new XMLSerializer().serializeToString(canvas.svg.node());
        const blob = new Blob([serialized], { type: "image/svg+xml" });
        onFinished(blob);
      }
      return canvas.gTotal;
    };
    return renderer;
  }

  renderTransition() {
    const renderer = (svgElement, charts, images) => {
      if (!charts || charts.length <= 1)
        throw new Error("More than 1 chart is required to draw transition.");

      this._drawProgress(svgElement, charts);
      const canvas = this._drawChart(this, svgElement, charts[0], images);

      charts.forEach((cht, i) => {
        if (i === 0) {
          return;
        }

        cht.accumedDelay =
          cht.delay + charts[i - 1].duration + charts[i - 1].accumedDelay;
        this._applyTransition(this, canvas, cht);
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

    this._drawProgress(svgElement, charts);
    const svg = d3.select(svgElement);
    const progress = svg.select("g.progress");
    const allProgress = svg.selectAll(".progress");
    const progressTweener = this._getAllTweeners(progress);
    allProgress.interrupt();

    let chain = Promise.resolve();
    charts.forEach((cht, i) => {
      if (i === 0) {
        return;
      }
      const cht0 = charts[i - 1];
      const cht1 = charts[i];
      cht1.accumedDelay2 = cht1.delay + cht1.duration + cht0.accumedDelay2;
      if (i === charts.length - 1) cht1.isLastChart = true;
      chain = chain.then(() =>
        this._recordSingleTransition(
          gif,
          svgElement,
          cht0,
          cht1,
          images,
          progressTweener
        )
      );
    });
    chain.then(() => {
      gif.render();
    });
  }

  _recordSingleTransition(
    gif,
    svgElement,
    cht0,
    cht1,
    images,
    progressTweener
  ) {
    return new Promise((resolve0, reject) => {
      const canvas = this._drawChart(this, svgElement, cht0, images);
      const g = canvas.gTotal;
      cht1.accumedDelay = cht1.delay;

      this._applyTransition(this, canvas, cht1);

      const allElements = g.selectAll("*:not(.progress)");
      const tweeners = this._getAllTweeners(g);
      let totalDuration = cht1.accumedDelay + cht1.duration;

      allElements.interrupt();
      const frames = 30 * totalDuration / 1000;

      let chain = Promise.resolve();
      d3.range(frames).forEach((f, i) => {
        chain = chain.then(() => {
          return new Promise(function(resolve1, reject) {
            addFrame((f + 1) / frames * totalDuration, resolve1);
          });
        });
      });

      if (cht1.isLastChart) {
        totalDuration += 200;
        const lastSceneFrames = (cht1.lastFor || 2000) / 1000 * 30;
        d3.range(lastSceneFrames).forEach((f, i) => {
          chain = chain.then(() => {
            return new Promise(function(resolve1, reject) {
              addFrame(totalDuration, resolve1);
            });
          });
        });
      }

      chain.then(() => {
        resolve0();
      });

      function jumpToTime(t) {
        tweeners.forEach(function(tween) {
          tween(t);
        });
        progressTweener.forEach(function(tween) {
          tween(cht0.accumedDelay2 + t);
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
            delay: totalDuration / frames
            // copy: true
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
      .attr("stroke", chart.theme.colorAxis)
      .attr("stroke-width", "1");
    // .attr("fill", chart.theme.colorSecondary);
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
      .attr("stroke", chart.theme.colorAxis)
      .attr("stroke-width", "1");
    // .attr("fill", "none");
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
    // console.log(chart.yScale.domain());
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
    const yAxis = axisLeft(chart.yScale)
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
    // select selection if g is transition
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
    if (!chart.reference) return;
    g
      .append("text")
      .attr("class", "referenceText")
      .attr("font-size", chart.fontsize_reference + "px")
      .attr("fill", chart.fontcolor_reference)
      .text(`출처: ${chart.reference}`);
  }

  _drawMadeBy(g, chart) {
    if (!chart.madeBy) return;
    g
      .append("text")
      .attr("class", "madeByText")
      .attr("font-size", chart.fontsize_madeBy + "px")
      .attr("fill", chart.fontcolor_madeBy)
      .text(`만든이: ${chart.madeBy}`);
  }

  _drawLogo(g, chart) {
    const text = g
      .append("text")
      .attr("class", "logoText")
      .attr("font-size", chart.fontsize_reference + "px");
    text
      .append("tspan")
      .attr("fill", chart.fontcolor_reference)
      // .style("font-family", "Spoqa Hans")
      .style("font-weight", 200)
      .text("powered by ");
    text
      .append("tspan")
      .attr("fill", chart.colorBI)
      .style("font-weight", 500)
      .text("jiggle");
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
      rect.attr(
        "fill",
        (d, i) =>
          chart.indexToFocus.includes(i)
            ? chart.colorToFocus
            : chart.z(d[chart.xLabel])
      );
      // .style(
      //   "opacity",
      //   (d, i) =>
      //     chart.indexToFocus.includes(i) ? chart.opacity : chart.opacityToHide
      // );
    }
  }

  _drawProgress(svgElement, charts) {
    charts[0].duration = charts[0].delay = 0;
    let totalProgress = 0;

    charts.forEach((cht, i) => {
      if (i === 0) return;
      cht.isRecording = true;
      totalProgress += cht.delay + cht.duration;
    });
    const svg = d3.select(svgElement);
    svg.selectAll("*").remove();
    const scaleOpacity = d3
      .scaleQuantize()
      .domain([0, 1])
      // .range([1, 0.66, 0.33, 0]);
      .range([0.33, 0.66, 1]);
    const gProgress = svg
      .append("g")
      .attr("class", "progress")
      .attr("transform", `translate(0, ${charts[0].height_svg - 7})`);
    gProgress
      .append("rect")
      .attr("class", "progress")
      .attr("width", 0)
      .attr("height", 7)
      .attr("fill", charts[0].colorBI)
      .transition()
      .duration(totalProgress - 500)
      .delay(500)
      .ease(d3.easeLinear)
      .attrTween("opacity", function(d, i) {
        return function(t) {
          return scaleOpacity(t);
        };
      })
      .attr("width", charts[0].width_svg + 20);
  }

  _drawSkeleton(svgElement, chart) {
    let svg = d3.select(svgElement);

    svg.selectAll("*:not(.progress)").remove();

    // console.log(chart.isRecording);
    // if (chart.isRecording) {
    //   console.log("Removed but progress bar");
    //   svg.selectAll("*:not(.progress)").remove();
    // } else {
    //   console.log("Removed all");
    //   svg.selectAll("*").remove();
    // }
    // svg.selectAll("*:not(#images)").remove();
    svg
      // .attr("width", chart.width_svg)
      // .attr("height", chart.height_svg)
      .attr("viewBox", `0 0 ${chart.width_svg} ${chart.height_svg}`)
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

    let gTitleBox = gHeader
      .append("g")
      .attr("class", "titleBox")
      .attr("transform", `translate(0,${chart.y_g_title})`);
    let gLegend = gHeader
      .append("g")
      .attr("class", "legendBox")
      .attr("transform", `translate(${chart.x_g_legend}, ${chart.y_g_title})`)
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
    let gLogo = gReferenceBox
      .append("g")
      .attr("class", "logo")
      .attr("transform", `translate(${chart.x_g_legend}, 0)`)
      .style("text-anchor", "end");
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
      gLogo,
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

  _staticOrTransition(g, chart, isTransition) {
    if (isTransition) {
      g = g
        .transition()
        .duration(chart.duration)
        .delay((d, i) => i * 800);
    }
    g
      .attr("y", function(d) {
        return chart.yScale(d.value);
      })
      .attr("height", function(d) {
        return chart.height_g_body - chart.yScale(d.value);
      });
  }
}
