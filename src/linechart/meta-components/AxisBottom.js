import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Axis from './Axis';
import ORIENT from './constants/orientation';

const propTypes = {
  axisClassName: PropTypes.string,
  axisLineClassName: PropTypes.string,
  hideAxisLine: PropTypes.bool,
  hideTicks: PropTypes.bool,
  hideZero: PropTypes.bool,
  label: PropTypes.string,
  labelClassName: PropTypes.string,
  labelOffset: PropTypes.number,
  labelProps: PropTypes.object,
  left: PropTypes.number,
  numTicks: PropTypes.number,
  rangePadding: PropTypes.number,
  scale: PropTypes.func.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  strokeDasharray: PropTypes.string,
  tickClassName: PropTypes.string,
  tickFormat: PropTypes.func,
  tickLabelProps: PropTypes.func,
  tickLength: PropTypes.number,
  tickStroke: PropTypes.string,
  tickTransform: PropTypes.string,
  tickValues: PropTypes.array,
  top: PropTypes.number,
  children: PropTypes.func,
};

export default function AxisBottom({
  children,
  axisClassName,
  axisLineClassName,
  hideAxisLine,
  hideTicks,
  hideZero,
  label,
  labelClassName,
  labelOffset = 8,
  labelProps,
  left,
  numTicks,
  rangePadding,
  scale,
  stroke,
  strokeWidth,
  strokeDasharray,
  tickClassName,
  tickFormat,
  tickLabelProps = ({ tick, index }) => ({
    dy: '0.25em',
    fill: 'black',
    fontFamily: 'Arial',
    fontSize: 10,
    textAnchor: 'middle',
  }),
  tickLength = 8,
  tickStroke,
  tickTransform,
  tickValues,
  top,
}) {
  return (
    <Axis
      axisClassName={cx('vx-axis-bottom', axisClassName)}
      hideTicks={hideTicks}
      label={label}
      left={left}
      scale={scale}
      stroke={stroke}
      tickLabelProps={tickLabelProps}
      tickValues={tickValues}
      tickFormat={tickFormat}
      top={top}
      children={children}
    />
  );
}

AxisBottom.propTypes = propTypes;