const arr0 = [
  ["letter", "frequency"],
  ["Q1", ".11"],
  ["Q2", ".22"],
  ["Q3", ".28"]
  // ["Q4", ".80"]
];

const arr1 = [
  ["letter", "frequency"],
  ["Q1", ".11"],
  ["Q2", ".22"],
  ["Q3", ".28"],
  ["Q4", ".97"]
];

const arr2 = [
  ["letter", "frequency"],
  ["Q1", ".11"],
  ["Q2", ".22"],
  ["Q3", ".28"],
  ["Q4", ".97"],
  ["Q5", ".50"]
];

const tak = [["t", "v"], ["1", 2], ["3", 4], ["5", 6]];
const tak2 = [["t", "v"], ["1", 2], ["3", 4], ["5", 6], ["7", 8]];

const id = 1;
// const graph_colors = [
//   "#499fc9",
//   "#4a67c6",
//   "#af4390",
//   "#5d9ec6",
//   "#43acaf",
//   "#594ac6",
//   "#8544aa",
//   "#4ac6ae"
// ];
const label = [
  {
    row: 1,
    col: 1,
    comment: "hi"
  }
];
// const colorToFocus = "#000";
// const theme = {
//   backgroundColor: "#F9F9F9",
//   colorPrimary: "#000000",
//   colorSecondary: "#4B4949",
//   colorTernary: "#7F7F7F"
// };
const DARK = {
  colorPrimary: "#ffffff",
  colorSecondary: "#d9dadb",
  colorTernary: "#ffffff",
  backgroundColor: "#2c2d2e",
  colorStripe1: "#333435",
  colorStripe2: "#2c2d2e"
};
// const LIGHT = {
//   colorPrimary: "#000000",
//   colorSecondary: "#4B4949",
//   colorTernary: "#7f7f7f",
//   backgroundColor: "#f3f4f5",
//   colorStripe1: "#e6e7e8",
//   colorStripe2: "#f3f4f5"
// };
export const cht0 = {
  id,
  // graph_colors,
  // indexToFocus: [2],
  // colorToFocus,
  label,
  theme: DARK,
  rawData: tak,
  // rawData: arr0,
  duration: 0,
  delay: 0,
  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자",
  numOfYAxisTicks: 3
};

export const cht1 = {
  id,
  // graph_colors,
  // colorToFocus,
  label,
  theme: DARK,
  rawData: tak2,
  // rawData: arr1,
  duration: 1000,
  delay: 500,
  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자",
  numOfYAxisTicks: 5
};

export const cht2 = {
  id,
  label,
  theme: DARK,
  rawData: arr2,
  duration: 1000,
  delay: 500,
  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자",
  numOfYAxisTicks: 5
};
