const csv0 = `letter,frequency
A,.06167
B,.01492
C,.02782
D,.08786
E,.03386`;

const csv1 = `letter,frequency
A,.08167
B,.01492
D,.03386`;

const csv2 = `letter,frequency
A,.08167
B,.01492
C,.02782
D,.03386`;

// const csv0 = `letter,frequency
// A,.06167`;

// const csv1 = `letter,frequency
// A,.08167
// B,.01492`;

// const csv2 = `letter,frequency
// A,.08167`;

// const csv3 = `letter,frequency
// A,.08167
// B,.02782
// C,.03386`;

// const csv2 = `letter,frequency
// A,.08167
// B,.01492
// C,.02782`;

const csv3 = `letter,frequency
A,.08167
B,.01492
C,.02782
D,.03386
E,.01234
F,.05647`;

const type = "bar";
const width_svg = 600;
const height_svg = 500;
const margins = { top: 40, bottom: 40, left: 30, right: 30 };
const focusType = "";
const backgroundColor = "white";
const color = "steelblue";
const colorToFocus = "gold";
const opacity = 1;
const opacityToHide = 0.15;
const duration = 0;
const delay = 0;
const accumedDelay = 0;

export const chart0 = {
  type,
  rawData: csv0,
  width_svg,
  height_svg,
  margins,
  focusType,
  duration,
  delay,
  accumedDelay,
  backgroundColor,
  color,
  colorToFocus,
  opacity,
  opacityToHide
};

export const chart1 = {
  type,
  rawData: csv1,
  width_svg,
  height_svg,
  margins,
  focusType: "minAndMax",
  duration: 2000,
  delay: 0,
  accumedDelay,
  backgroundColor,
  color: "steelblue",
  colorToFocus: "gold",
  opacity: 1,
  opacityToHide: 0.15
};

export const chart2 = {
  type,
  rawData: csv2,
  width_svg,
  height_svg,
  margins,
  focusType: "startAndEnd",
  duration: 2000,
  delay: 2000,
  accumedDelay,
  backgroundColor,
  color: "steelblue",
  colorToFocus: "red",
  opacity: 1,
  opacityToHide: 0.15
};

export const chart3 = {
  type,
  rawData: csv3,
  width_svg,
  height_svg,
  margins,
  focusType: "startAndEnd",
  duration: 2000,
  delay: 0,
  accumedDelay,
  color: "steelblue",
  colorToFocus: "green",
  opacity: 1,
  opacityToHide: 0.15
};
