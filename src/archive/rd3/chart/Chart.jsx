import React from "react";
import PropTypes from "prop-types";

export default class Chart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    return (
      <svg
        className={props.className_svg}
        height={props.height_svg}
        width={props.width_svg}
      >
        {props.children}
      </svg>
    );
  }
}

Chart.propTypes = {
  height_svg: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width_svg: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Chart.defaultProps = {
  height_svg: 500,
  width_svg: 960
};
