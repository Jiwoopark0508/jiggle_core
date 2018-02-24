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
  ["Q4", ".80"],
  ["Q5", ".50"]
];

const id = 1;
const graph_colors = [
  "#499fc9",
  "#4a67c6",
  "#af4390",
  "#5d9ec6",
  "#43acaf",
  "#594ac6",
  "#8544aa",
  "#4ac6ae"
];
const label = [
  {
    row: 1,
    col: 1,
    comment: "hi"
  }
];
const colorToFocus = "#000";
export const cht0 = {
  id,
  // graph_colors,
  // indexToFocus: [2],
  // colorToFocus,
  // label,
  rawData: arr0,
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
  rawData: arr1,
  duration: 2000,
  delay: 1000,
  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자",
  numOfYAxisTicks: 7
};

export const cht2 = {
  id,
  rawData: arr2,
  duration: 3000,
  delay: 2000,
  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자"
  // numOfYAxisTicks,
};
