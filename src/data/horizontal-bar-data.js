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

const id = 4;
// const graph_colors = ["#fff", "#000"];
const label = [
  {
    row: 1,
    col: 1,
    comment: "hi"
  }
];

export const hcht0 = {
  id,
  label,
  // graph_colors,
  rawData: arr0,
  duration: 0,
  delay: 0,

  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자"
};

export const hcht1 = {
  id,
  label,
  // graph_colors,
  rawData: arr1,
  duration: 1500,
  delay: 2000,

  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자"
};

export const hcht2 = {
  rawData: arr2,
  duration: 1500,
  delay: 2000,

  unit: "%",
  title: "주요 금융그룹 충당금",
  subtitle: "부제는 여기에 위치합니다",
  reference: "통계청",
  madeBy: "강선미 기자"
};
