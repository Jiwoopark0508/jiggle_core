import React from "react";
import cx from "classnames";
import { Line } from "@vx/shape";
import { Group } from "@vx/group";
import { Point } from "@vx/point";
import RectPanel from "./rect_panel";

export default function StripeRows({
  top = 0,
  left = 0,
  scale,
  width,
  height,
  stroke = "#eaf0f6",
  strokeWidth = 1,
  strokeDasharray,
  className,
  numTicks = 10,
  lineStyle,
  tickValues,
  ...restProps
}) {
  return (
    <Group className={cx("vx-columns", className)} top={top} left={left}>
      {tickValues &&
        tickValues.map((d, i) => {
          if (i < 1) return;
          let ly = scale(tickValues[i - 1]);
          let ry = scale(tickValues[i]);
          let fromPoint = new Point({
            x: 0,
            y: ry
          });
          let toPoint = new Point({
            x: width,
            y: ly
          });
          return (
            <RectPanel
              key={`column-line-${d}-${i}`}
              from={fromPoint}
              to={toPoint}
              width={width}
              height={ly - ry}
              isFill={i % 2 != 0}
              fill={restProps.fill}
              {...restProps}
            />
          );
        })}
    </Group>
  );
}
