import React, { Component } from "react";
import "./App.css";
import Workspace from "./react-d3/Workspace";
import { appleStock } from '@vx/mock-data'

const data1 = appleStock;
const data2 = appleStock.map((d) => { return {"close" : d.close * 2, "date" : d.date}})
const data3 = appleStock.map((d) => { return {"close" : d.close * 3, "date" : d.date}})
/**
 * 
 */
const chart1 = {
  data : [data1.slice(0, data1.length / 8), 
          data2.slice(0, data2.length / 4),
          data3.slice(0, data3.length / 4),],
  duration : 1000,
  delay : 1000
}

const chart2 = {
  data : [data1.slice(0, data1.length * 1 / 3),
          data2.slice(0, data2.length * 1 / 3),
          data3.slice(0, data3.length * 2 / 4),],
  duration : 2000,
  delay : 2000
}

const chart3 = {
  data : [data1.slice(0, data1.length),
          data2.slice(0, data2.length * 5 / 10),
          data3.slice(0, data3.length),],
  duration : 3000,
  delay : 3000
}

/**
 * 
 * Todo 1 / 31
 * Sync chart props b/w LineChart and BarChart
 * Like duration, delay... etc...
 */

class App extends Component {
  render() {
    return <Workspace width="700" height="450" 
            chart={[
              chart1, chart2, chart3
            ]
            } />;
  }
}

export default App;
