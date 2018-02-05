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

export default class TransitionLinePath extends React.Component {
    constructor(props){
        super(props)
        this.prevPath = null
        this.transPath = null
        this.startsAt = 0
        this.endsAt = 0
        this._playTransition = this._playTransition.bind(this)
        this.playTransition = this.playTransition.bind(this)
        this.state = {
            prevData : this.props.prevData,
            nextData : this.props.nextData
        }
    }
    
    componentDidMount() {
        this.startsAt = this.prevPath.getTotalLength();
        this.endsAt = this.transPath.getTotalLength();
    }
    
    componentDidUpdate() {
        this.startsAt = this.prevPath.getTotalLength();
        this.endsAt = this.transPath.getTotalLength();
    }

    setPrevNextData(prev, next, duration, delay) {
        this.setState({
            prevData : prev,
            nextData : next
        })
        this.playTransition(duration, delay)
    }

    playTransition(duration, delay) {
        let g = d3.select(this.transPath)
        g.call(this._playTransition, duration, delay)
    }

    _playTransition(g, duration, delay) {

        let endsAt = this.endsAt
        let startsAt = this.startsAt
        g
            .attr("stroke-dasharray", endsAt + " " + (endsAt - startsAt))
            .attr("stroke-dashoffset", (endsAt - startsAt))
            .transition()
            .duration(duration)
            .delay(delay)
            .attr("stroke-dashoffset", 0)

    }

    render() {
        const props = this.props;

        return (
            <Group>
                <LinePath 
                    className="hellWorld"
                    innerRef={(node) => this.prevPath = node}
                    data = {this.state.prevData}
                    xScale={props.xScale}
                    yScale={props.yScale}
                    x={props.x}
                    y={props.y}
                    style={{"display" : "none"}}
                />
                <LinePath 
                    innerRef={(node) => this.transPath = node}
                    data = {this.state.nextData}
                    xScale={props.xScale}
                    yScale={props.yScale}
                    x={props.x}
                    y={props.y}
                />
            </Group> 
        )  
    }
}