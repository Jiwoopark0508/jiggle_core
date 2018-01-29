import React from "react";
import BarChartFactory from "./barchart/BarChartFactory";
import { ParseData } from "./common/utils";

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const props = this.props;
    props.charts.forEach(chart => ParseData(chart));
    const factory = new BarChartFactory();
    // const rendererStatic = factory.renderChartStatic();
    // rendererStatic(this.node, props.charts[1]);
    const renderer = factory.renderChartTransition();
    renderer(this.node, [...props.charts]);
  }

  render() {
    return <svg ref={node => (this.node = node)} />;
  }
}
