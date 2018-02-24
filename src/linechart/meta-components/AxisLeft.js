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

export default function AxisLeft({
  children,
  axisClassName,
  axisLineClassName,
  hideAxisLine,
  hideTicks,
  hideZero,
  label,
  labelClassName,
  labelOffset = 36,
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
    dx: '-0.25em',
    dy: '0.25em',
    fill: 'black',
    fontFamily: 'Arial',
    fontSize: 10,
    textAnchor: 'end',
  }),
  tickLength = 8,
  tickStroke,
  tickTransform,
  tickValues,
  top,
}) {
  return (
    <Axis
      axisClassName={cx('vx-axis-left', axisClassName)}
      axisLineClassName={axisLineClassName}
      hideTicks={hideTicks}
      label={label}
      labelProps={labelProps}
      left={left}
      numTicks={numTicks}
      orientation={ORIENT.left}
      scale={scale}
      stroke={stroke}
      tickLabelProps={tickLabelProps}
      tickValues={tickValues}
      top={top}
      children={children}
    />
  );
}

AxisLeft.propTypes = propTypes;