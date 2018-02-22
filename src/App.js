import React, { Component } from "react";
import "./App.css";
import { GRAPH_COLOR } from './common/constant'
import Workspace from "./Workspace";
import { dummie } from './data/line_dummy10'
import { DARK, LIGHT } from './common/constant'


const chart1 = {
  rawData : dummie.slice(0, 2),
  duration : 750,
  title : "주요 금융그룹 충당금 주요 금융그룹",
  subtitle : "이것은 1부제입니다",
  reference : "이것은 1레퍼런스입니다",
  caption : "이것은 1캡처입니다",
  madeBy : "강선미 기자",
  delay : 3000,
  width_svg : 1080,
  height_svg : 600,
  margins : {
    top : 40, bottom : 40, left: 60, right : 60
  },
  label : [
    {row: 2, col:1, comment: "asf"},
    {row: 9, col:1, comment: "asf"},
  ],
  ...LIGHT,
  graph_colors : GRAPH_COLOR
}
const chart2 = {
  rawData : dummie.slice(0, 3),
  duration : 1000,
  title : "주요 금융그룹 충당금 주요 금융그룹",
  subtitle : "이것은 1부제입니다",
  reference : "이것은 1레퍼런스입니다",
  caption : "이것은 1캡처입니다",
  madeBy : "강선미 기자",
  delay : 1000,
  width_svg : 1080,
  height_svg : 600,
  margins : {
    top : 40, bottom : 40, left: 60, right : 60
  },
  label : [
    {row: 5, col:1, comment: "asf"},
  ],
  ...LIGHT,
  graph_colors : GRAPH_COLOR
}
const chart3 = {
  rawData : dummie,
  duration : 1000,
  title : "주요 금융그룹 충당금 주요 금융그룹",
  subtitle : "이것은 1부제입니다",
  reference : "이것은 1레퍼런스입니다",
  caption : "이것은 1캡처입니다",
  madeBy : "강선미 기자",
  delay : 1000,
  width_svg : 1080,
  height_svg : 600,
  margins : {
    top : 40, bottom : 40, left: 60, right : 60
  },
  label : [
    {row: 5, col:1, comment: "asf"},
  ],
  ...LIGHT,
  graph_colors : GRAPH_COLOR
}



class App extends Component {
  render() {
    return (
      <div>
        <Workspace width="1024" height="768"
            charts={[
              chart1, chart2, chart3
            ]
            } />
          <div id="gif" />
      </div>
    );
  }
}

export default App;
