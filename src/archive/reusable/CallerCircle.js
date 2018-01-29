import React, { Component } from "react";
import ClassCircle from "./chart/ClassCircle";
// import { select } from "d3-selection";

export default class Circle extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     color: props.color
        // };
        this.createBarChart = this.createBarChart.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }
    componentDidMount() {
        this.createBarChart();
    }
    componentDidUpdate() {
        this.createBarChart();
    }
    changeColor() {
        this.setState({ color: "red" });
    }
    createBarChart() {
        // console.log(this.props);
        let chart = new ClassCircle({ ...this.props });
        // let selection = select(this.node);
        chart.renderCircle(this.node);

        // const node = this.node;
        // select(node)
        //     .append("circle")
        //     .attr("fill", this.state.color)
        //     .attr("cx", 10)
        //     .attr("cy", 10)
        //     .attr("r", 5)
        //     .on("click", this.changeColor);

        // const dataMax = max(this.props.data);
        // const yScale = scaleLinear()
        //     .domain([0, dataMax])
        //     .range([0, this.props.size[1]]);
        // select(node)
        //     .selectAll("rect")
        //     .data(this.props.data)
        //     .enter()
        //     .append("rect");

        // select(node)
        //     .selectAll("rect")
        //     .data(this.props.data)
        //     .exit()
        //     .remove();

        // select(node)
        //     .selectAll("rect")
        //     .data(this.props.data)
        //     .style("fill", "#fe9922")
        //     .attr("x", (d, i) => i * 25)
        //     .attr("y", d => this.props.size[1] - yScale(d))
        //     .attr("height", d => yScale(d))
        //     .attr("width", 25);
    }
    render() {
        return (
            <svg ref={node => (this.node = node)} width={500} height={500} />
        );
    }
}
