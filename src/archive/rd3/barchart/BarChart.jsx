import React, { Component } from "react";
import PropTypes from "prop-types";
import CartesianChartProps from "../HOC/CartesianChartProps";
import Chart from "../common/chart/Chart";
import DataSeries from "../barchart/DataSeries";

export default class BarChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const vars = {
      width_svg: 600,
      height_svg: 200
    };

    return (
      <Chart {...vars} {...props}>
        <DataSeries rawData={props.rawData} {...vars} {...props} />
      </Chart>
    );
  }
}

BarChart.propTypes = {
  ...CartesianChartProps.propTypes,
  chartClassName: PropTypes.string,
  rawData: PropTypes.string.isRequired,
  hoverAnimation: PropTypes.bool,
  margins: PropTypes.object,
  rangeRoundBandsPadding: PropTypes.number,
  // https://github.com/mbostock/d3/wiki/Stack-Layout#offset
  stackOffset: PropTypes.oneOf(["silhouette", "expand", "wigget", "zero"]),
  grouped: PropTypes.bool,
  valuesAccessor: PropTypes.func,
  xAccessor: PropTypes.func,
  yAccessor: PropTypes.func,
  y0Accessor: PropTypes.func,
  title: PropTypes.string,
  xAxisClassName: PropTypes.string,
  yAxisClassName: PropTypes.string,
  yAxisTickCount: PropTypes.number
};

BarChart.defaultProps = {
  ...CartesianChartProps.defaultProps,
  chartClassName: "rd3-barchart",
  hoverAnimation: true,
  margins: { top: 10, right: 20, bottom: 40, left: 45 },
  rangeRoundBandsPadding: 0.25,
  stackOffset: "zero",
  grouped: false,
  valuesAccessor: d => d.values,
  y0Accessor: d => d.y0,
  xAxisClassName: "rd3-barchart-xaxis",
  yAxisClassName: "rd3-barchart-yaxis",
  yAxisTickCount: 4
};

// BarChart.propTypes = {
//     fill: PropTypes.string,
//     width: PropTypes.number,
//     height: PropTypes.number,
//     x: PropTypes.number,
//     y: PropTypes.number,
//     className: PropTypes.string
// };
