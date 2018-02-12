import React, { Component } from "react";
import "./App.css";

import Workspace from "./Workspace";
import { gChart0 } from "./data/grouped-bar-data";
import { sChart0 } from "./data/stacked-bar-data";
import { appleStock } from "@vx/mock-data";
import { dummie } from './data/line_dummy'

const chart1 = {
  data : dummie.slice(0, 2),
  duration : 750,
  delay : 3000
}

const chart2 = {
  data : dummie.slice(0, dummie.length / 2),
  duration : 500,
  delay : 2000
}

const chart3 = {
  data : dummie,
  duration : 1000,
  delay : 1000
}

class App extends Component {
  render() {
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
}

export default App;
