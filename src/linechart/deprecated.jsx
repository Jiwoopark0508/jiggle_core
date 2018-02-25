import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from "d3";
import JiggleLineStatic from './jiggle_line_static'
import JiggleLineTransition from './jiggle_line_transition';

export default class LineChartFactory {
  constructor() {
    this.lineInstance = null
  }
  renderChartStatic() {
    const renderer = (svgElement, chartConfig) => {
      this._drawStaticChart(svgElement, chartConfig)
    }
    return renderer;
  }
  
  renderTransition() {
    const renderer = (svgElement, chartConfigList) => {
      this._drawTransitionChart(svgElement, chartConfigList)

      this.lineInstance.chartList = chartConfigList
      this.lineInstance.playWholeLineTransition(chartConfigList)
    }
    return renderer;
  }
  
  _drawTransitionChart(svgElement, chartConfigList) {
    // this function draw transition between two chart configs
    let line_transition_instance = new JiggleLineTransition();
    this.lineInstance = line_transition_instance;
    let jiggle_line_transition = line_transition_instance.renderTransition(chartConfigList)
    ReactDOM.unmountComponentAtNode(svgElement)
    ReactDOM.render(jiggle_line_transition, document.getElementsByTagName('svg')[0])

    return jiggle_line_transition
  }
  
  recordTransition(svgElement, charts) {
    if (charts.length === 0) return;
    let gif = new window.GIF({
      workers: 1,
      quality: 10,
      repeat: 0
    })
    const gifToPresent = d3.select("#gif");
    gif.on("progress", function(p) {
      gifToPresent.text(d3.format("%")(p) + " rendered")
    })

    gif.on("finished", function(blob) {
      gifToPresent
        .text("")
        .append("img")
        .attr("src", URL.createObjectURL(blob));
    })
    let chain = Promise.resolve()
    charts.forEach((cht, i) => {
      if (i < 1) return;
      let cht0 = charts[i - 1]
      let cht1 = charts[i]
      chain = chain.then(() => 
        this._recordSingleTransition(gif, svgElement, cht0, cht1)
      )
    })
    // chain.then(() => gif.render())
  }
  
  _recordSingleTransition(gif, svgElement, cht0, cht1) {
    return new Promise((resolve0, reject) => {
      let g = this._drawTransitionChart(svgElement, cht0, cht1)
      cht1.accumedDelay = cht1.delay;
      let component = g._self
      g = d3.select(g._self.domNode)
      g.call(this._applyTransition, cht0, cht1, component)

      const allElements = g.selectAll("*");
      const tweeners = this._getAllTweeners(g)
      const totalDuration = cht1.accumedDelay + cht1.duration;
      allElements.interrupt();
      const frames = 20 * totalDuration / 1000;

    //   let promises = [];
    //   d3.range(frames).forEach(function(f, i) {
    //     promises.push(
    //       new Promise(function(resolve1, reject) {
    //         addFrame((f + 1) / frames * totalDuration, resolve1);
    //     }))
    //   })
    //   Promise.all(promises).then(function(results) {
    //     d3
    //       .select(svgElement)
    //       .selectAll("*")
    //       .remove();
    //     resolve0();
    //   })
    //   function jumpToTime(t) {
    //     tweeners.forEach(function(tween) {
    //       tween(t);
    //     })
    //   }

    //   function addFrame(t, resolve1) {
    //     jumpToTime(t);
    //     let img = new Image(),
    //       serialized = new XMLSerializer().serializeToString(svgElement),
    //       blob = new Blob([serialized], {type: "image/svg+xml"}),
    //       url = URL.createObjectURL(blob);
    //     img.onload = function() {
    //       gif.addFrame(img, {
    //         delay : totalDuration / frames,
    //         copy : true
    //       })
    //       resolve1()
    //     }
    //     img.src = url
    //   }
    })
  }

  _applyTransition(g, cht0, cht1, component) {
    component.transPathLines.forEach((l, i) => {
      l.setPrevNextData(cht0.data[i], cht1.data[i], cht1.duration, cht1.delay)
    })
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

  _drawStaticChart(svgElement, chartConfig) {
    let line_static_instance = new JiggleLineStatic();
    let jiggle_line = line_static_instance.renderChartStatic(chartConfig);
    ReactDOM.unmountComponentAtNode(svgElement)
    ReactDOM.render(jiggle_line, document.getElementsByTagName('svg')[0])
  }

}
