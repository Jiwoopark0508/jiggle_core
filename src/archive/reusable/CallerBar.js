import React, { Component } from "react";
import ClassBar from "./chart/ClassBar";

export default class CallerBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <svg ref={node => (this.node = node)} width={500} height={500} />
        );
    }
}
