const arr0 = [
  ["letter", "frequency"],
  ["Q1", ".11"],
  ["Q2", ".22"],
  ["Q3", ".28"]
];

const arr1 = [
  ["letter", "frequency"],
  ["Q1", ".11"],
  ["Q2", ".22"],
  ["Q3", ".28"],
  ["Q4", ".80"]
];

const arr2 = [
  ["letter", "frequency"],
  ["Q1", ".11"],
  ["Q2", ".22"],
  ["Q3", ".28"],
  ["Q4", ".80"],
  ["Q5", ".50"]
];

const type = "bar";
const width_svg = 750;
const height_svg = 433;
const margins = { top: 28, bottom: 40, left: 50, right: 50 };
const focusType = "";
const backgroundColor = "white";
const color = "#3182bd";
const colorToFocus = "#e6550d";
const opacity = 1;
const opacityToHide = 0.25;
const duration = 0;
const delay = 1000;
const accumedDelay = 0;
const easingType = "easeCubic";
const delayType = "accumedDelay";
const paddingBtwRects = 0.4;
const radius = 10;
const isLastChart = false;
const lastFor = 2000;
const numOfYAxisTicks = 8;
const colorStripe1 = "";
const colorStripe2 = "";

const fontFamily = "sans-serif";
const title = "Title";
const subtitle = "Subtitle";
const unit = "unit";
const legend = "legend";
const reference = "reference";
const madeBy = "anonymous";

const fontsize_title = "";
const fontsize_subtitle = "";
const fontsize_unit = "";
const fontsize_legend = "";
const fontsize_reference = "";

const fontcolor_title = "";
const fontcolor_subtitle = "";
const fontcolor_unit = "";
const fontcolor_legend = "";
const fontcolor_reference = "";

const fontstyle_title = "";
const fontstyle_unit = "";
const fontstyle_reference = "";

// Line: 4px;

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
  // duration: 1500,
  // delay: 1800,
  duration: 0,
  delay: 0,
  accumedDelay,
  easingType: "easeBackOut",
  delayType: "delayInOrder",

  backgroundColor,
  paddingBtwRects,
  radius,
  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자",
  numOfYAxisTicks,
  fontFamily,
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
  delay: 2000,
  accumedDelay,
  easingType: "easeBackOut",
  delayType: "delayInOrder",
  lastFor: 2000,

  backgroundColor,
  paddingBtwRects,
  radius,
  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자",
  numOfYAxisTicks,
  fontFamily,
  color,
  colorToFocus,
  opacity,
  opacityToHide
};

export const chart2 = {
  type,
  rawData: arr2,
  width_svg,
  height_svg,
  margins,

  focusType: "end",
  duration: 1500,
  delay: 2000,
  accumedDelay,
  easingType: "easeBackOut",
  delayType: "delayInOrder",
  lastFor: 2000,

  backgroundColor,
  paddingBtwRects,
  radius,
  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자",
  numOfYAxisTicks,
  fontFamily,
  color,
  colorToFocus,
  opacity,
  opacityToHide
};
