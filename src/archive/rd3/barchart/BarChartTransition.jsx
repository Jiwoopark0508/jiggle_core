import React from "react";
import * as d3 from "d3";

export default class BarChartTransition extends React.Component {
  constructor(props) {
    super(props);
  }

  _prepareG(chart) {
    const data = d3.csvParse(chart.rawData, chart.dataFormatter);
    let xScale = d3
      .scaleBand()
      .domain(data.map(chart.xAccessor))
      .rangeRound([0, chart.width_g])
      .padding(0.1);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, chart.yAccessor)])
      .nice()
      .rangeRound([chart.height_g, 0]);

    let svg = d3
      .select(this.node)
      .attr("width", 600)
      .attr("height", 500);
    let g = svg.append("g").attr("transform", `translate(30,30)`);

    return g;
  }

  _renderPrevBarChart() {
    const props = this.props;
    const prev = props.prevChart;
    const prevData = d3.csvParse(prev.rawData, dataFormatter);
    const dataFormatter = d => {
      return { letter: d.letter, frequency: +d.frequency };
    };
    const xAccessor = d => d.letter;
    const yAccessor = d => d.frequency;
    const width_g = 400;
    const height_g = 400;
    let xScale = d3
      .scaleBand()
      .domain(prevData.map(xAccessor))
      .rangeRound([0, width_g])
      .padding(0.1);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(prevData, yAccessor)])
      .nice()
      .rangeRound([height_g, 0]);

    let svg = d3
      .select(this.node)
      .attr("width", 600)
      .attr("height", 500);
    let g = svg.append("g").attr("transform", `translate(30,30)`);

    g
      .selectAll("rect")
      .data(prevData, d => d.letter)
      .enter()
      .append("rect")
      .attr("fill", "steelblue")
      .attr("x", d => xScale(d.letter))
      .attr("y", d => yScale(d.frequency))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height_g - yScale(d.frequency));

    return g;
  }

  _applyTransition(prevG) {
    const props = this.props;
    const next = props.nextChart;
    const nextData = d3.csvParse(next.rawData, dataFormatter);
    const dataFormatter = d => {
      return { letter: d.letter, frequency: +d.frequency };
    };
    const xAccessor = d => d.letter;
    const yAccessor = d => d.frequency;
    const width_g = 400;
    const height_g = 400;
    let xScale = d3
      .scaleBand()
      .domain(nextData.map(xAccessor))
      .rangeRound([0, width_g])
      .padding(0.1);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(nextData, yAccessor)])
      .nice()
      .rangeRound([height_g, 0]);

    let rect = prevG
      .selectAll("rect")
      .data(nextData, d => d.letter)
      .transition()
      .duration(3000)
      .attr("fill", "steelblue")
      .attr("x", d => xScale(d.letter))
      .attr("y", d => yScale(d.frequency))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height_g - yScale(d.frequency));
  }

  componentDidMount() {
    const prevG = this._renderPrevBarChart();
    this._applyTransition(prevG);
  }

  render() {
    const props = this.props;
    /*
    chart1: object
    chart2: object

    chart: rawData, attrs
     */

    return <svg ref={node => (this.node = node)} />;
  }
}
