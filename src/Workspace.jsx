import React from "react";

import BarFactory from "./factory/bar-factory";
import HorizontalBarFactory from "./factory/horizontal-bar-factory";
import GroupedBarFactory from "./factory/grouped-bar-factory";
import parseBar from "./parser/bar-parser";
import parseHorizontalBar from "./parser/horizontal-bar-parser";
import parseGroupedBar from "./parser/grouped-bar-parser";
import SmallDataLineFactory from "./factory/small-line-factory";
import LargeDataLineFactory from "./factory/large-line-factory";

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const props = this.props;


    const factory = new LargeDataLineFactory();
    // const renderer = factory.renderChart();
    // renderer(this.node, props.charts[0]);
    const renderTransition = factory.renderTransition();
    renderTransition(this.node, [...props.charts]);

    // factory.recordTransition(this.node, [...props.charts]);
  }

  render() {
    return (
      <div>
        <svg ref={node => (this.node = node)} />
      </div>
    );
  }
}
