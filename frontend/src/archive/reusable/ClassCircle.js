import * as d3 from "d3";

export default class ClassCircle {
    constructor(config) {
        // console.log(config);
        this.config = config;
        // console.log(this.config);
    }

    renderCircle(node) {
        let selection = d3.select(node);
        let config = this.config;
        selection.each(function(data) {
            selection
                .append("circle")
                .attr("fill", config.color)
                .attr("cx", 10)
                .attr("cy", 10)
                .attr("r", 5);
        });
    }
}
