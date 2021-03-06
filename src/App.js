import React, { Component } from "react";
import "./App.css";
import { GRAPH_COLOR, GRAPH_COLOR2 } from "./common/constant";
import Workspace from "./Workspace";
import { cht0, cht1, cht2, cht3 } from "./data/bar-data";
import { gcht0, gcht1 } from "./data/grouped-bar-data";
import { hcht0, hcht1 } from "./data/horizontal-bar-data";
import { dummie } from "./data/line_dummy13";
import { DARK, LIGHT } from "./common/constant";

const chart1 = {
  rawData: dummie.slice(0, 2),
  duration: 1000,
  title: "최근 3년간 한국항공우주 주가 추이",
  subtitle: "(단위: 원)",
  reference: "*자료: 한국거래소",
  caption: "이것은 1캡처입니다",
  madeBy: "그래픽 : 유정수 디자이너",
  delay: 1000,
  width_svg: 1080,
  height_svg: 600,
  margins: {
    top: 40,
    bottom: 40,
    left: 60,
    right: 60
  },
  theme: { ...DARK },
  label: [
    { row: 196, col: 1, comment: "감사원, 원가부풀리기 감사결과 발표" },
    { row: 587, col: 1, comment: "서울중앙지검, 본사 서울사무소, 압수수색" },
    { row: 680, col: 1, comment: "분식회계 의혹 수사" }
  ],
  graph_colors: GRAPH_COLOR,
  unit: "원"
};
const chart2 = {
  rawData: dummie.slice(0, 196),
  duration: 1000,
  delay: 1000
};
const chart3 = {
  rawData: dummie.slice(0, 587),
  duration: 1000,
  delay: 1000
};

const chart4 = {
  rawData: dummie,
  duration: 1000,
  delay: 1000
};

class App extends Component {
  render() {
    let flag;
    flag = "horizontal";
    // flag = "group";
    // flag = "single";
    // flag = "jiwoo"

    // horizontal
    if (flag === "horizontal") {
      return (
        <div>
          <Workspace charts={[hcht0, hcht1]} />

          <div id="gif" />
        </div>
      );
    }
    // // group bar
    if (flag === "group") {
      return (
        <div>
          <Workspace charts={[gcht1]} />
          <div id="gif" />
        </div>
      );
    }

    // // single bar
    if (flag === "single") {
      return (
        <div>
          <Workspace charts={[cht0, cht1, cht2]} />
          <div id="gif" />
        </div>
      );
    }

    // return (
    //   <div>
    //     <Workspace
    //       width="1024"
    //       height="768"
    //       charts={[chart1, chart2, chart3, chart4]}
    //     />
    //     <div id="gif" />
    //   </div>
    // );
    // return (
    //   <div>
    //     <Workspace width="700" height="450" charts={[chart1, chart2, chart3]} />
    //     <div id="gif" />
    //   </div>
    // );

    // Jiwoo's
    // return (
    //   <div>
    //     <Workspace width="1024" height="768" charts={[chart1, chart2]} />
    //     <div id="gif" />
    //   </div>
    // );

    if (flag === "jiwoo") {
      return (
        <div>
          <Workspace
            width="1024"
            height="768"
            charts={[chart1, chart2, chart3, chart4]}
          />
          <div id="gif" />
        </div>
      );
    }
  }
}

export default App;
