import React from "react";
import Bar from "../barchart/Bar";
import PropTypes from "prop-types";
import * as d3 from "d3";

export default class DataSeries extends React.Component {
  constructor(props) {
    super(props);
  }

  _getSingleBar(datum) {
    return;
  }

  render() {
    const props = this.props;
    const dataArray = d3.csvParse(props.rawData, d => {
      return { letter: d.letter, frequency: +d.frequency };
    });
    const margins = props.margins;
    const width_g = +props.width_svg - margins.left - margins.right;
    const height_g = +props.height_svg - margins.top - margins.bottom;
    const xAccessor = d => d.letter;
    const yAccessor = d => d.frequency;
    const xScale = d3
      .scaleBand()
      .domain(dataArray.map(xAccessor))
      .rangeRound([0, width_g])
      .padding(0.1);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataArray, yAccessor)])
      .nice()
      .rangeRound([height_g, 0]);

    return (
      <g transform={`translate(${margins.left},${margins.top})`}>
        {dataArray.map(dataObject => {
          const xValue = xAccessor(dataObject);
          const yValue = yAccessor(dataObject);

          return (
            <Bar
              className="barchart-bar"
              fill_rect="steelblue"
              x={xScale(xValue)}
              y={yScale(yValue)}
              width_rect={xScale.bandwidth()}
              height_rect={height_g - yScale(yValue)}
              key={xValue}
            />
          );
        })}
      </g>
    );
  }
}

DataSeries.propTypes = {
  rawData: PropTypes.string.isRequired
};

DataSeries.defaultProps = {};
