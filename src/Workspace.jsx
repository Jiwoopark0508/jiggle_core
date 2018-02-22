import React from "react";

import BarFactory from "./factory/bar-factory";
import HorizontalBarFactory from "./factory/horizontal-bar-factory";
import GroupedBarFactory from "./factory/grouped-bar-factory";
import parseBar from "./parser/bar-parser";
import parseHorizontalBar from "./parser/horizontal-bar-parser";
import parseGroupedBar from "./parser/grouped-bar-parser";
import SmallDataLineFactory from "./factory/small-line-factory";
import LargeDataLineFactory from "./factory/large-line-factory";
import { getImageUrlFromBase64 } from "./common/utils";

const base64 =
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1klEQVR42n2TzytEURTHv3e8N1joRhZG" +
  "zJsoCjsLhcw0jClKWbHwY2GnLGUlIfIP2IjyY2djZTHSMJNQSilFNkz24z0/Ms2MrnvfvMu8mcfZvPvu" +
  "Pfdzz/mecwgKLNYKb0cFEgXbRvwV2s2HuWazCbzKA5LvNecDXayBjv9NL7tEpSNgbYzQ5kZmAlSXgsGG" +
  "XmS+MjhKxDHgC+quyaPKQtoPYMQPOh5U9H6tBxF+Icy/aolqAqLP5wjWd5r/Ip3YXVILrF4ZRYAxDhCO" +
  "J/yCwiMI+/xgjOEzmzIhAio04GeGayIXjQ0wGoAuQ5cmIjh8jNo0GF78QwNhpyvV1O9tdxSSR6PLl51F" +
  "nIK3uQ4JJQME4sCxCIRxQbMwPNSjqaobsfskm9l4Ky6jvCzWEnDKU1ayQPe5BbN64vYJ2vwO7CIeLIi3" +
  "ciYAoby0M4oNYBrXgdgAbC/MhGCRhyhCZwrcEz1Ib3KKO7f+2I4iFvoVmIxHigGiZHhPIb0bL1bQApFS" +
  "9U/AC0ulSXrrhMotka/lQy0Ic08FDeIiAmDvA2HX01W05TopS2j2/H4T6FBVbj4YgV5+AecyLk+Ctvms" +
  "QWK8WZZ+Hdf7QGu7fobMuZHyq1DoJLvUqQrfM966EU/qYGwAAAAASUVORK5CYII=";

const images = [
  {
    base64,
    mimeType: "image/png",
    x: "200px",
    y: "20px",
    width: "100px",
    height: "100px"
  },
  {
    base64,
    mimeType: "image/png",
    x: "300px",
    y: "20px",
    width: "100px",
    height: "100px"
  }
];

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // const imgUrl = getImageUrlFromBase64(base64, "image/png");
    // console.log(imgUrl);
    // console.log("Inserting an img...");
    // var img = document.querySelector("#image0");
    // img.src = imgUrl;

    const props = this.props;

    let flag;
    // flag = "Static";
    flag = "Transition";
    // flag = "Recording";

    // flag = "Grouped Static";

    // flag = "Horizontal Static";
    // flag = "Horizontal Transition";
    // flag = "Horizontal Recording";

    // horizontal single bar
    const horizontalBar = new HorizontalBarFactory();
    if (flag === "Horizontal Static") {
      props.charts.forEach(chart => parseHorizontalBar(chart));
      const renderer = horizontalBar.renderChart();
      renderer(this.node, props.charts[0]);
    }
    if (flag === "Horizontal Transition") {
      props.charts.forEach(chart => parseHorizontalBar(chart));
      const renderer = horizontalBar.renderTransition();
      renderer(this.node, [...props.charts]);
    }
    if (flag === "Horizontal Recording") {
      props.charts.forEach(chart => parseHorizontalBar(chart));
      const gifDiv = document.getElementById("gif");
      const onProcess = function(progress) {
        gifDiv.textContent = progress * 100 + "% rendered";
      };
      const onFinished = function(blob) {
        const imgElement = document.createElement("img");
        imgElement.src = URL.createObjectURL(blob);
        gifDiv.appendChild(imgElement);
      };

      const record = horizontalBar.recordTransition(
        this.node,
        [...props.charts],
        onProcess,
        onFinished
      );
    }

    // group bar
    const groupBar = new GroupedBarFactory();

    if (flag === "Grouped Static") {
      props.charts.forEach(chart => parseGroupedBar(chart));
      const renderer = groupBar.renderChart();
      renderer(this.node, props.charts[0]);
    }

    // single bar
    const bar = new BarFactory();

    if (flag === "Static") {
      props.charts.forEach(chart => parseBar(chart));
      const renderer = bar.renderChart();
      renderer(this.node, props.charts[0], images);
    }

    if (flag === "Transition") {
      props.charts.forEach(chart => parseBar(chart));
      const renderTransition = bar.renderTransition();
      renderTransition(this.node, props.charts, images);
    }

    if (flag === "Recording") {
      props.charts.forEach(chart => parseBar(chart));
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
        onFinished,
        images
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

    // const factory = new SmallDataLineFactory();
    // const renderer = factory.renderChart();
    // renderer(this.node, props.charts[0]);
    // const renderTransition = factory.renderTransition();
    // renderTransition(this.node, [...props.charts]);
  }

  render() {
    return (
      <div>
        <svg ref={node => (this.node = node)} />
      </div>
    );
  }
}
