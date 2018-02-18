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

    let flag;
    // flag = "Static";
    // flag = "Recording";
    flag = "Transition";

    // single bar
    const bar = new BarFactory();

    if (flag === "Static") {
      const renderer = bar.renderChart();
    }

    if (flag === "Transition") {
      const renderTransition = bar.renderTransition();
      renderTransition(this.node, [...props.charts]);
    }

    if (flag === "Recording") {
      const gifDiv = document.getElementById("gif");
      const onProcess = function(progress) {
        gifDiv.textContent = progress * 100 + "% rendered";
      };
      const onFinished = function(blob) {
        const imgElement = document.createElement("img");
        imgElement.src = URL.createObjectURL(blob);
        gifDiv.appendChild(imgElement);
      };

      const record = bar.recordTransition(
        this.node,
        [...props.charts],
        onProcess,
        onFinished
      );
    }
    // const gTotal = renderer(this.node, props.charts[0]);
    // console.log(bar.getChildG(renderer(this.node, props.charts[0])));

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
