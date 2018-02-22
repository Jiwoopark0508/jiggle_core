import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from "d3";
import JiggleLine from '../linechart/jiggle_line';
import _ from "lodash"

const LARGE = "LARGE"

export default class LargeDataLineFactory {
  constructor() {
    this.lineInstance = null
    this.modifiedState = null
  }

  renderChart() {
    const renderer = (svgElement, chartConfig, images) => {
      this._drawChart(svgElement, chartConfig, images)
    }
    return renderer;
  }
  
  renderTransition() {
    const renderer = (svgElement, chartConfigList) => {
      // const allElements = g.selectAll("*");
      // Stop all transition, and re draw
      this._drawChart(svgElement, chartConfigList)
      this.lineInstance.playWholeLineTransition(undefined, undefined, false)
    }
    return renderer;
  }
  
  _drawChart(svgElement, chartConfigList, images) {
    // this function draw transition between two chart configs
    d3.select(svgElement)
        .attr("width", chartConfigList[0].width_svg)
        .attr("height", chartConfigList[0].height_svg)
    let line_transition_instance = new JiggleLine(chartConfigList, LARGE);
    this.lineInstance = line_transition_instance;
    let jiggle_line_transition = line_transition_instance.renderTransitionLine(chartConfigList)
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
      chain = chain.then(() => 
        this._recordSingleTransition(gif, svgElement, charts, i)
      )
    })
    chain.then(() => gif.render())
  }
  
  _recordSingleTransition(gif, svgElement, chtList, idx) {
    return new Promise((resolve0, reject) => {
      let g = this._drawChart(svgElement, chtList)
      let component = g._self
      g = d3.select(g._self.domNode)

      g.call(this._applyTransition, component, idx, true)
      
      const allElements = g.selectAll("*");
      const tweeners = this._getAllTweeners(g)
    
      let totalDuration = 0
      let cht = chtList[idx]
      totalDuration = cht.duration + cht.delay

      allElements.interrupt();
      const frames = 20 * totalDuration / 1000;
      console.log(totalDuration)
      let promises = [];
      d3.range(frames).forEach(function(f, i) {
        promises.push(
          new Promise(function(resolve1, reject) {
            addFrame((f + 1) / frames * totalDuration, resolve1);
        }))
      })
      Promise.all(promises).then(function(results) {
        d3
          .select(svgElement)
          .selectAll("*")

        resolve0();
      })
      function jumpToTime(t) {
        tweeners.forEach(function(tween) {
          tween(t);
        })
      }

      function addFrame(t, resolve1) {
        jumpToTime(t);
        let img = new Image(),
          serialized = new XMLSerializer().serializeToString(svgElement),
          blob = new Blob([serialized], {type: "image/svg+xml"}),
          url = URL.createObjectURL(blob);
        img.onload = function() {
          gif.addFrame(img, {
            delay : totalDuration / frames,
            copy : true
          })
          resolve1()
        }
        img.src = url
      }
    })
  }

  _applyTransition(g, component, idx, record) {
    component.playWholeLineTransition(idx, true, record)
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
        console.log(tran)
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
