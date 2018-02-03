import React, { Component } from "react";
import "./App.css";
import Workspace from "./react-d3/Workspace";
import { chart0, chart1, chart2, chart3 } from "./react-d3/data/bar-data";
import { gChart0 } from "./react-d3/data/grouped-bar-data";
import { sChart0 } from "./react-d3/data/stacked-bar-data";

class App extends Component {
  // render() {
  //   return <Workspace charts={[chart0, chart1, chart2]} />;
  // }
  render() {
    return (
      <div>
        <Workspace charts={[chart0, chart1, chart2]} />
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
