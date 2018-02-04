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
  
  renderChartTransition() {
    const renderer = (svgElement, chartConfigList) => {
      this._drawTransitionChart(svgElement, chartConfigList[0], chartConfigList[chartConfigList.length - 1])

      let chartDelay = 0
      this.lineInstance.chartList = chartConfigList
      this.lineInstance.playAllTransition()
    }
    return renderer;
  }
  
  _drawStaticChart(svgElement, chartConfig) {
    let line_static_instance = new JiggleLineStatic();
    let jiggle_line = line_static_instance.renderChartStatic(chartConfig);

    ReactDOM.render(jiggle_line, document.getElementsByTagName('svg')[0])
  }

  _drawTransitionChart(svgElement, fromChart, toChart) {
    // this function draw transition between two chart configs
    let line_transition_instance = new JiggleLineTransition();
    line_transition_instance.setFromToChart(fromChart, toChart)
    this.lineInstance = line_transition_instance;

    let jiggle_line_transition = line_transition_instance.renderTransition(toChart)
    ReactDOM.render(jiggle_line_transition, document.getElementsByTagName('svg')[0])
  }

  // _triggerTransition(fromChart, toChart) {
  //   // transition from fromChart to toChart
  //   this.transPath.setFromToChart(fromChart, toChart)
  // }

  // _extractData(chartConfig) {

  // }

}
