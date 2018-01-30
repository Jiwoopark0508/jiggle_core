import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from "d3";
import JiggleLineStatic from './jiggle_line_static'
import JiggleLineTransition from './jiggle_line_transition';

export default class LineChartFactory {
  renderChartStatic() {
    const renderer = (svgElement, chartConfig) => {
      this._drawStaticChart(svgElement, chartConfig)
    }
    return renderer;
  }
  // Render n - 1 Transition Component then execute animation 
  // n - 1 times
  renderChartTransition() {
    // Here goes function that calls _applyTransition
    const renderer = (svgElement, chartConfigs) => {
      this._drawTransitionChart(svgElement, chartConfigs)
    }
    return renderer;
  }
  _refineData() {

  }
  _drawStaticChart(svgElement, chartConfig) {
    let line_static_instance = new JiggleLineStatic();
    let jiggle_line = line_static_instance.renderChartStatic(chartConfig);

    ReactDOM.render(jiggle_line, document.getElementsByTagName('svg')[0])
  }

  _drawTransitionChart(svgElement, chartConfig) {
    // Here calls transition logic from transition
    let line_transition_instance = new JiggleLineTransition();
    chartConfig = {
      "dataSet": [{from : chartConfig[0],
                    to : chartConfig[1]}]
    }
    let jiggle_line_transition = line_transition_instance.renderChartTransition(chartConfig)
    
    ReactDOM.render(jiggle_line_transition, document.getElementsByTagName('svg')[0])
    // console.log(line_transition_instance.node)
    // setTimeout(()=>{
    //   console.log(line_transition_instance.node)
    //   console.log(d3.select(line_transition_instance.node))
    // }, 15000)
  }

  _extractData(chartConfig) {

  }

}
