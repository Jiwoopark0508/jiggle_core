import React, { Component } from "react";
import "./App.css";
import { GRAPH_COLOR } from "./common/constant";
import Workspace from "./Workspace";
import { cht0, cht1, cht2 } from "./data/bar-data";
import { gcht0, gcht1 } from "./data/grouped-bar-data";
import { hcht0, hcht1 } from "./data/horizontal-bar-data";
import { dummie } from "./data/line_dummy10";
import { DARK, LIGHT } from "./common/constant";

let partition = [50, 100, 200];
const chart1 = {
  rawData: dummie.slice(0, 2),
  duration: 750,
  title: "최근 3년간 한국항공우주 주가 추이",
  subtitle: "(단위: 원)",
  reference: "*자료: 한국거래소",
  caption: "이것은 1캡처입니다",
  madeBy: "그래픽 : 유정수 디자이너",
  delay: 3000,
  width_svg: 1080,
  height_svg: 600,
  margins: {
    top: 40,
    bottom: 40,
    left: 60,
    right: 60
  },
  label: [
    {
      row: partition[0],
      col: 1,
      comment: "감사원, 원가부풀리기 감사결과 발표"
    },
    {
      row: partition[1],
      col: 1,
      comment: "서울중앙지검, 본사, 서울사무소 압수수색"
    },
    { row: partition[2], col: 1, comment: "분식회계 의혹 수사" }
  ],
  ...LIGHT,
  graph_colors: GRAPH_COLOR
};
const chart2 = {
  rawData: dummie.slice(0, 100),
  duration: 750,
  title: "주요 금융그룹 충당금 주요 금융그룹",
  subtitle: "이것은 1부제입니다",
  reference: "이것은 1레퍼런스입니다",
  caption: "이것은 1캡처입니다",
  madeBy: "강선미 기자",
  delay: 750,
  width_svg: 1080,
  height_svg: 600,
  margins: {
    top: 40,
    bottom: 40,
    left: 60,
    right: 60
  },
  label: [{ row: 5, col: 1, comment: "asf" }],
  ...LIGHT,
  graph_colors: GRAPH_COLOR
};
const chart3 = {
  rawData: dummie.slice(0, 250),
  duration: 750,
  title: "주요 금융그룹 충당금 주요 금융그룹",
  subtitle: "이것은 1부제입니다",
  reference: "이것은 1레퍼런스입니다",
  caption: "이것은 1캡처입니다",
  madeBy: "강선미 기자",
  delay: 750,
  width_svg: 1080,
  height_svg: 600,
  margins: {
    top: 40,
    bottom: 40,
    left: 60,
    right: 60
  },
  label: [{ row: 5, col: 1, comment: "asf" }],
  ...LIGHT,
  graph_colors: GRAPH_COLOR
};
const chart4 = {
  rawData: dummie,
  duration: 500,
  title: "주요 금융그룹 충당금 주요 금융그룹",
  subtitle: "이것은 1부제입니다",
  reference: "이것은 1레퍼런스입니다",
  caption: "이것은 1캡처입니다",
  madeBy: "강선미 기자",
  delay: 750,
  width_svg: 1080,
  height_svg: 600,
  margins: {
    top: 40,
    bottom: 40,
    left: 60,
    right: 60
  },
  label: [{ row: 5, col: 1, comment: "asf" }],
  ...LIGHT,
  graph_colors: GRAPH_COLOR
};

class App extends Component {
  render() {
    let flag;
    // flag = "horizontal";
    // flag = "group";
    flag = "single";

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
          <Workspace charts={[cht0, cht1]} />
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
    //     <Workspace width="1024" height="768"
    //         charts={[
    //           chart1, chart2
    //         ]
    //         } />
    //       <div id="gif" />
    //   </div>
    //   );

    // Jiwoo's
    // return (
    //   <div>
    //     <Workspace width="1024" height="768"
    //         charts={[
    //           chart1, chart2, chart4
    //         ]
    //         } />
    //       <div id="gif" />
    //   </div>
    // );
  }
}

export default App;
