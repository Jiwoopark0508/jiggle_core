import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
import JiggleLine from "../linechart/jiggle_line";
import * as utils from '../common/utils'

const SMALL = "SMALL"; // This template is for small data line

export default class SmallDataLineFactory {
  constructor() {
    this.lineInstance = null;
  }
  renderChart() {
    const renderer = (svgElement, chart, images) => {
      let line = this._drawStaticChart(svgElement, chart, images);
      return line;
    };
    return renderer;
  }

  _drawStaticChart(svgElement, chart, images) {
    // this function draw transition between two chart configs
    // d3.select(svgElement).select("g.graph").remove()
      
    d3
      .select(svgElement)
      .attr("viewBox", `0 0 ${chart[0].width_svg} ${chart[0].height_svg}`)

    let line_instance = new JiggleLine(chart, images, SMALL);
    this.lineInstance = line_instance;
    let jiggle_line = line_instance.renderLine(chart);
    line_instance.drawGlyphLabel();
    ReactDOM.unmountComponentAtNode(svgElement);
    ReactDOM.render(jiggle_line, svgElement);
    return jiggle_line;
  }
  renderTransition() {
    const renderer = (svgElement, chartConfigList, images) => {
      chartConfigList = utils._addFirstLastBuffer(chartConfigList)
      this._drawTransitionChart(svgElement, chartConfigList, images);
      process.nextTick(() => {
        this.lineInstance.playWholeLineTransition(undefined, undefined, false);
      })
    };
    return renderer;
  }

  _drawTransitionChart(svgElement, chartConfigList, images) {
    // this function draw transition between two chart configs
    // d3.select(svgElement).select("g.graph").remove()

    d3
    .select(svgElement)
    .attr("viewBox", `0 0 ${chartConfigList[0].width_svg} ${chartConfigList[0].height_svg}`)
    let line_instance = new JiggleLine(chartConfigList, images, SMALL);
    this.lineInstance = line_instance;
    let jiggle_line_transition = line_instance.renderLine(chartConfigList);
    // line_instance.eraseGlyphLabel();
    ReactDOM.unmountComponentAtNode(svgElement);
    ReactDOM.render(jiggle_line_transition, svgElement);

    return jiggle_line_transition;
  }

  recordTransition(svgElement, charts, onProcess, onFinished, images) {
    charts = utils._addFirstLastBuffer(charts)
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
      if (i < 1) return;
      chain = chain.then(() =>
        this._recordSingleTransition(gif, svgElement, charts, i, images)
      );
    });
    chain.then(() => gif.render());
  }

  _recordSingleTransition(gif, svgElement, chtList, idx, images) {
    return new Promise((resolve0, reject) => {
      let g = this._drawTransitionChart(svgElement, chtList, images);
      let component = this.lineInstance;
      console.log(this.lineInstance)
      console.log(component)
      g = d3.select(g._self.gParent);
      
      this._applyTransition(component, idx, true)
      
      const allElements = g.selectAll("*");
      const tweeners = this._getAllTweeners(g);

      let totalDuration = 0;
      let cht = chtList[idx];
      totalDuration = cht.duration + cht.delay;

      allElements.interrupt();
      const frames = 20 * totalDuration / 1000;
      let chain = Promise.resolve();
      d3.range(frames).forEach(function(f, i) {
        chain = chain.then(() => {
          return new Promise(function(resolve1, reject) {
            addFrame((f + 1) / frames * totalDuration, resolve1);
          })
        })
      });
      chain.then(() => {
        resolve0();
      })
      
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

  _applyTransition(component, idx, record) {
    component.playWholeLineTransition(idx, true, record);
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
