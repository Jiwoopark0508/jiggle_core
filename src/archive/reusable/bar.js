/*
config: margin, width, height, padding
 */
function barChart(config) {
    var margin = config.margin,
        width = +config.width - margin.left - margin.right,
        height = +config.height - margin.top - margin.bottom,
        color = "red",
        x = d3
            .scaleBand()
            .rangeRound([0, width])
            .padding(config.padding),
        y = d3.scaleLinear().rangeRound([height, 0]);

    function chart(selection) {
        selection.each(function(data) {
            var svg = d3
                .select(this)
                .append("svg")
                .attr("width", config.width)
                .attr("height", config.height);

            var g = svg
                .append("g")
                .attr(
                    "transform",
                    "translate(" + margin.left + "," + margin.top + ")"
                );

            x.domain(
                data.map(function(d) {
                    return d.letter;
                })
            );

            y.domain([
                0,
                d3.max(data, function(d) {
                    return d.frequency;
                })
            ]);

            g
                .append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g
                .append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(10, "%"))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Frequency");

            g
                .selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("fill", color)
                .attr("x", function(d) {
                    return x(d.letter);
                })
                .attr("y", function(d) {
                    return y(d.frequency);
                })
                .attr("width", x.bandwidth())
                .attr("height", function(d) {
                    return height - y(d.frequency);
                });
        });
    }

    chart.color = function(_) {
        if (!arguments.length) return color;
        color = _;
        return chart;
    };
    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };
    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };
    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };
    chart.x = function(_) {
        if (!arguments.length) return x;
        x = _;
        return chart;
    };
    chart.y = function(_) {
        if (!arguments.length) return y;
        y = _;
        return chart;
    };

    return chart;
}
