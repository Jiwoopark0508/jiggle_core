import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Bar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    return (
      <rect
        className={props.className}
        fill={props.fill_rect}
        x={props.x}
        y={props.y}
        width={props.width_rect}
        height={props.height_rect}
      />
    );
  }
}

Bar.propTypes = {
  className: PropTypes.string,
  fill: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number
};

Bar.defaultProps = {
  className: "barchart-bar",
  fill: "steelblue",
  xAccessor: d => d.x,
  yAccessor: d => d.y
};
