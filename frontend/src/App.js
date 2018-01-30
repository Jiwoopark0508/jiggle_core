import React, { Component } from "react";
import "./App.css";
import Workspace from "./react-d3/Workspace";
import { appleStock } from '@vx/mock-data'
import dummies from './bar_dummy'

// Line Data Preparation

const data1 = appleStock;
const data2 = appleStock.map(d => {
  return {
    date : d.date,
    close : d.close * 2
  }
})
const data3 = appleStock.map(d => {
  return {
    date : d.date,
    close : d.close * 3
  }
})

// const chart0 = {
//   dataSet : [appleStock.slice(0, appleStock.length / 2)]
// }

// const chart1 = {
//   dataSet : [appleStock.slice(0, appleStock.length)]
// }

class App extends Component {
  render() {
    return <Workspace width="700" height="450" chart={[data1.slice(0, data1.length / 2), data2, data3]} />;
  }
}

export default App;
