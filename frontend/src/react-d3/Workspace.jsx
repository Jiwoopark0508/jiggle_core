import React from "react";
import BarChartFactory from "./barchart/BarChartFactory";
import { ParseData } from "./common/utils";
import LineChartFactory from "./linechart/LineChartFactory";
import * as d3 from 'd3'


export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const props = this.props;
    // props.charts.forEach(chart => ParseData(chart));
    // const factory = new BarChartFactory();
    const factory = new LineChartFactory();
    // console.log(d3.select(this.node).trasition())
    // const rendererStatic = factory.renderChartStatic();
    // rendererStatic(this.node, props.chart);
    const renderer = factory.renderChartTransition();
    renderer(this.node, [...props.chart]);
  }

  render() {
    return (
      <div>
          <svg width={this.props.width}
              height={this.props.height}
              ref={node => (this.node = node)} />
      </div>)
  }
}
