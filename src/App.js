import React, { Component } from "react";
import "./App.css";
import Workspace from "./react-d3/Workspace";

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

const type = "bar";
const width_svg = 600;
const height_svg = 500;
const margins = { top: 40, bottom: 40, left: 30, right: 30 };
const focusType = "";
const color = "steelblue";
const colorToFocus = "gold";
const opacity = 1;
const opacityToHide = 0.15;
const duration = 0;
const delay = 0;

const chart0 = {
  type,
  rawData: csv0,
  width_svg,
  height_svg,
  margins,
  focusType,
  duration,
  delay,
  color,
  colorToFocus,
  opacity,
  opacityToHide
};

const chart1 = {
  type,
  rawData: csv1,
  width_svg,
  height_svg,
  margins,
  focusType: "minAndMax",
  duration: 2000,
  delay: 500,
  color: "steelblue",
  colorToFocus: "gold",
  opacity: 1,
  opacityToHide: 0.15
};

const chart2 = {
  type,
  rawData: csv2,
  width_svg,
  height_svg,
  margins,
  focusType: "startAndEnd",
  duration: 2000,
  delay: 500,
  color: "steelblue",
  colorToFocus: "red",
  opacity: 1,
  opacityToHide: 0.15
};

class App extends Component {
  render() {
    return <Workspace charts={[chart0, chart1, chart2]} />;
  }
}

export default App;
