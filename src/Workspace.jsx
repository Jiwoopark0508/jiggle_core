import React from "react";
import BarFactory from "./factory/bar-factory";
import GroupedBarFactory from "./factory/grouped-bar-factory";
import StackedBarFactory from "./factory/stacked-bar-factory";
import { parseBar } from "./parser/bar-parser";
import { parseGroupedBar } from "./parser/grouped-bar-parser";
import { parseStackedBar } from "./parser/stacked-bar-parser";
import LineChartFactory from "./factory/line-factory";

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const props = this.props;
    props.charts.forEach(chart => parseBar(chart));

    // single bar
    const bar = new BarFactory();
    // draw chart
    // const renderer = bar.renderChart();
    // renderer(this.node, props.charts[0]);
    // draw transition
    // const renderTransition = bar.renderTransition();
    // renderTransition(this.node, [...props.charts]);
    // record transition
    const record = bar.recordTransition(this.node, [...props.charts]);

    // line
    // const factory = new LineChartFactory();

    // grouped bar
    // props.charts.forEach(chart => parseGroupedBar(chart));
    // const factory = new GroupedBarFactory();
    // const renderer = factory.renderChart();
    // renderer(this.node, props.charts[0]);

    // stacked bar
    // props.charts.forEach(chart => parseStackedBar(chart));
    // const factory = new StackedBarFactory();
    // const renderer = factory.renderChart();
    // renderer(this.node, props.charts[0]);
  }

  render() {
    return (
      <div>
        <svg ref={node => (this.node = node)} />
      </div>
    );
  }
}
