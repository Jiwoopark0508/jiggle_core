import React, { Component } from "react";
import "./App.css";

import Workspace from "./Workspace";
import { gChart0 } from "./data/grouped-bar-data";
import { sChart0 } from "./data/stacked-bar-data";
import { appleStock } from "@vx/mock-data";
import { dummy } from './data/line_dummy'

const data1 = dummy;
const data2 = dummy.map(d => {
  return { x: d.x, y: d.y * 2 };
});
const data3 = dummy.map(d => {
  return { x: d.x, y: d.y * 3 };
});

const chart1 = {
  data : [data1.slice(0, 1),
          data2.slice(0, 1),],
  duration : 750,
  delay : 3000
}

const chart2 = {
  data : [
          data1.slice(0, data1.length * 1 / 3),
          data2.slice(0, data1.length * 1 / 3),
        ],
  duration : 500,
  delay : 1500
}

const chart3 = {
  data : [
          data1.slice(0, data1.length),
          data2.slice(0, data1.length),
        ],
  duration : 1000,
  delay : 1000
}

/**
 *
 * Todo 1 / 31
 * Sync chart props b/w LineChart and BarChart
 * Like duration, delay... etc...
 */

class App extends Component {
  render() {
    // return (
    //   <div>
    //     <Workspace charts={[chart0, chart1, chart2, chart3]} />
    //     <div id="gif" />
    //   </div>
    // );
    return (
      <div>
        <Workspace width="700" height="450"
            charts={[
              chart1, chart2, chart3
            ]
            } />
          <div id="gif" />
      </div>
      );
  }
  // render() {
  //   return <Workspace charts={[gChart0]} />;
  // }
  // render() {
  //   return <Workspace charts={[sChart0]} />;
  // }
}

export default App;
