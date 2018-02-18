import React, { Component } from "react";
import "./App.css";

import Workspace from "./Workspace";
import { gChart0 } from "./data/grouped-bar-data";
import { sChart0 } from "./data/stacked-bar-data";
import { dummie } from './data/line_dummy6'
import { DARK, LIGHT } from './common/constant'

const chart1 = {
  data : dummie.slice(0, 2),
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
  ...DARK
}

const chart2 = {
  data : dummie.slice(0, 3),
  title : "이것은 2제목입니다.",
  sub_title : "이것은 2부제입니다",
  reference : "이것은 2레퍼런스입니다",
  caption : "이것은 2캡처입니다",
  madeBy : "강선미 기자",

  delay : 0,
  duration : 1000,
  width_svg : 700,
  height_svg : 500,
  margins : {
    top : 100, bottom : 60, left: 60, right : 60
  },
  ...DARK
}

const chart3 = {
  data : dummie.slice(0, 5),
  title : "이것은 3제목입니다.",
  sub_title : "이것은 3부제입니다",
  reference : "이것은 3레퍼런스입니다",
  caption : "이것은 3캡처입니다",
  delay : 1000,
  duration : 1000,
  width_svg : 700,
  height_svg : 500,
  margins : {
    top : 100, bottom : 60, left: 60, right : 60
  },
  ...DARK
}

const chart4 = {
  data : dummie,
  title : "이것은 3제목입니다.",
  sub_title : "이것은 3부제입니다",
  reference : "이것은 3레퍼런스입니다",
  caption : "이것은 3캡처입니다",
  delay : 1000,
  duration : 1000,
  width_svg : 700,
  height_svg : 500,
  margins : {
    top : 100, bottom : 60, left: 60, right : 60
  },
  ...DARK
}


class App extends Component {
  render() {
    return (
      <div>
        <Workspace width="1024" height="768"
            charts={[
              chart1, chart2, chart3, chart4
            ]
            } />
          <div id="gif" />
      </div>
    );
    // return (
    //   <div>
    //     <Workspace width="700" height="450"
    //         charts={[
    //           chart1, chart2, chart3
    //         ]
    //         } />
    //       <div id="gif" />
    //   </div>
    //   );
  }
}

export default App;
