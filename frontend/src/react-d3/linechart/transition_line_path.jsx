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
        this._playTransition = this._playTransition.bind(this)
    }
    componentDidMount(){
        // console.log(this.prevPath)
        this._playTransition()
        // console.log(d3.transition)
    }
    _playTransition() {
        let startsAt = this.prevPath.getTotalLength()
        let endsAt = this.nextPath.getTotalLength()        
        // console.log(d3.select(this.nextPath))
        d3.select(this.nextPath)
            .attr("stroke-dasharray", endsAt + " " + (endsAt - startsAt))
            .attr("stroke-dashoffset", (endsAt - startsAt))
            .transition()
            .duration(7500)
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
                    innerRef={(node) => this.nextPath = node}
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