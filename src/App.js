import React, { Component } from "react";
import "./App.css";

import Workspace from "./Workspace";
import { gChart0 } from "./data/grouped-bar-data";
import { sChart0 } from "./data/stacked-bar-data";
import { appleStock } from "@vx/mock-data";
import { dummie } from './data/line_dummy4'

const chart1 = {
  data : dummie.slice(0, 2),
  duration : 750,
  title : "이것은 1제목입니다.",
  sub_title : "이것은 1부제입니다",
  reference : "이것은 1레퍼런스입니다",
  caption : "이것은 1캡처입니다",
  delay : 3000
}

const chart2 = {
  data : dummie.slice(0, 3),
  title : "이것은 2제목입니다.",
  sub_title : "이것은 2부제입니다",
  reference : "이것은 2레퍼런스입니다",
  caption : "이것은 2캡처입니다",
  delay : 0,
  duration : 1000,
}

const chart3 = {
  data : dummie.slice(0, 5),
  title : "이것은 3제목입니다.",
  sub_title : "이것은 3부제입니다",
  reference : "이것은 3레퍼런스입니다",
  caption : "이것은 3캡처입니다",
  delay : 1000,
  duration : 1000,
}

const chart4 = {
  data : dummie,
  title : "이것은 3제목입니다.",
  sub_title : "이것은 3부제입니다",
  reference : "이것은 3레퍼런스입니다",
  caption : "이것은 3캡처입니다",
  delay : 1000,
  duration : 1000,
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
  }
}

export default App;
