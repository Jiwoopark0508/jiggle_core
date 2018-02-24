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

const id = 2;
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
export const cht0 = {
  id,
  // graph_colors,
  // indexToFocus: [2],
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
  rawData: arr1,
  duration: 1500,
  delay: 2000,
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
  duration: 1500,
  delay: 2000,
  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자"
  // numOfYAxisTicks,
};
