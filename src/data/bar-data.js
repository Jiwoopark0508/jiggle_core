const arr0 = [
  ["letter", "frequency"],
  ["Q1", ".11"],
  ["Q2", ".22"],
  ["Q3", ".24"]
];

const arr1 = [
  ["letter", "frequency"],
  ["Q1", ".11"],
  ["Q2", ".22"],
  ["Q3", ".24"],
  ["Q4", ".80"]
];

const type = "bar";
const width_svg = 400;
const height_svg = 500;
const margins = { top: 40, bottom: 40, left: 30, right: 30 };
const focusType = "";
const backgroundColor = "white";
const color = "#3182bd";
const colorToFocus = "#e6550d";
const opacity = 1;
const opacityToHide = 0.25;
const duration = 0;
const delay = 1000;
const accumedDelay = 0;
const paddingBtwRects = 0.4;
const easing = "easeCubic";
const radius = 10;
const delayType = "accumedDelay";
const unit = "%";
const title = "Title";
const subTitle = "Subtitle";
const dataSource = "통계청";
const fontFamily = "sans-serif";
const fontSize = "15px";
const fontColor = "black";
const isLastChart = false;
const lastFor = 2000;

/*
title, subtitle, reference, caption
 */

export const chart0 = {
  type,
  rawData: arr0,
  width_svg,
  height_svg,
  margins,

  focusType,
  duration: 1500,
  delay: 1800,
  accumedDelay,
  easing: "easeBackOut",
  delayType: "delayInOrder",

  backgroundColor,
  paddingBtwRects,
  radius,
  unit,
  title: "이 데이터는",
  subTitle,
  dataSource,
  fontFamily,
  fontSize,
  fontColor,
  color,
  colorToFocus,
  opacity,
  opacityToHide
};

export const chart1 = {
  type,
  rawData: arr1,
  width_svg,
  height_svg,
  margins,

  focusType: "end",
  duration: 1500,
  delay,
  accumedDelay,
  easing: "easeBackOut",
  delayType: "delayInOrder",
  lastFor: 1000,

  backgroundColor,
  paddingBtwRects,
  radius,
  unit,
  title: "구라입니다.",
  subTitle,
  dataSource,
  fontFamily,
  fontSize,
  fontColor,
  color,
  colorToFocus,
  opacity,
  opacityToHide
};
