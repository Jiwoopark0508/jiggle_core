/* Although its name is linechart_transition 
 * Its role is to take two data input and make it transition.
 * Maybe it is proper to name it as *transition linepath*
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import { AxisLeft, AxisBottom } from '@vx/axis'
import * as d3 from 'd3'

// Variables which change with props later
const width = 750
const height = 400

const x = d => new Date(d.date)
const y = d => d.close

// Bounds

const margin = {
    top : 60,
    bottom : 60,
    left: 80,
    right : 80
}

const xMax = width - margin.left - margin.right
const yMax = height - margin.top - margin.bottom

export default class TransitionLinePath extends React.Component {
    constructor(props){
        super(props)
        this.prevPath = null
        this.startsAt = 0
        this.endsAt = 0
        this.transPath = null
        this._playTransition = this._playTransition.bind(this)
        this.playTransition = this.playTransition.bind(this)
    }
    componentDidMount() {
        this.startsAt = this.prevPath.getTotalLength();
        this.endsAt = this.transPath.getTotalLength();
    }
    playTransition() {
        this._playTransition(800, 800)
    }
    _playTransition(duration, delay) {
        let endsAt = this.endsAt
        let startsAt = this.startsAt
        console.log(endsAt, startsAt)
        // this.transPath.interrupt()

        d3.select(this.transPath)
            .attr("stroke-dasharray", endsAt + " " + (endsAt - startsAt))
            .attr("stroke-dashoffset", (endsAt - startsAt))
            .transition()
            .duration(duration)
            .attr("stroke-dashoffset", 0)
    }

    render() {
        const props = this.props;

        return (
            <Group>
                <LinePath 
                    className="hellWorld"
                    innerRef={(node) => this.prevPath = node}
                    data = {props.prevData}
                    xScale={props.xScale}
                    yScale={props.yScale}
                    x={x}
                    y={y}
                    style={{"display" : "none"}}
                />
                <LinePath 
                    innerRef={(node) => this.transPath = node}
                    data = {props.nextData}
                    xScale={props.xScale}
                    yScale={props.yScale}
                    x={x}
                    y={y}
                />
            </Group> 
        )  
    }
}