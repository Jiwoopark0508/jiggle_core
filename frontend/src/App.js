import React, { Component } from "react";
import "./App.css";
import Workspace from "./react-d3/Workspace";
import { chart0, chart1, chart2, chart3 } from "./react-d3/data/bar-data";
import { gChart0 } from "./react-d3/data/grouped-bar-data";
import { sChart0 } from "./react-d3/data/stacked-bar-data";
import { appleStock } from "@vx/mock-data";

const data1 = appleStock;
const data2 = appleStock.map(d => {
  return { close: d.close * 2, date: d.date };
});
const data3 = appleStock.map(d => {
  return { close: d.close * 3, date: d.date };
});
/**
 *
 */
// const chart1 = {
//   data : [data1.slice(0, data1.length / 3),
//           data2.slice(0, data2.length / 3),],
//   duration : 750,
//   delay : 3000
// }

// const chart2 = {
//   data : [data1.slice(0, data1.length * 2 / 3),
//           data2.slice(0, data2.length * 2 / 3),],
//   duration : 750,
//   delay : 3000
// }

// const chart3 = {
//   data : [data1.slice(0, data1.length),
//           data2.slice(0, data2.length),],
//   duration : 750,
//   delay : 3000
// }

/**
 *
 * Todo 1 / 31
 * Sync chart props b/w LineChart and BarChart
 * Like duration, delay... etc...
 */

class App extends Component {
  // render() {
  //   return <Workspace charts={[chart0, chart1, chart2]} />;
  // }
  render() {
    return (
      <div>
        <Workspace charts={[chart0, chart1, chart2, chart3]} />
        <div id="gif" />
      </div>
    );
    // return <Workspace width="700" height="450"
    //         chart={[
    //           chart1, chart2, chart3
    //         ]
    //         } />;
  }
  // render() {
  //   return <Workspace charts={[gChart0]} />;
  // }
  // render() {
  //   return <Workspace charts={[sChart0]} />;
  // }
}

export default App;
