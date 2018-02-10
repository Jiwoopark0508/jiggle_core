/* Although its name is linechart_transition 
 * Its role is to take two data input and make it transition.
 * Maybe it is proper to name it as *transition linepath*
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import { GlyphDot } from '@vx/glyph';
import { AxisLeft, AxisBottom } from '@vx/axis'
import * as d3 from 'd3'

export default class TransitionLinePath extends React.Component {
    constructor(props){
        super(props)
        this.pathList = []
        this.lengthList = []
        this.glyphList = []
        this.transPath = null
        this._playTransition = this._playTransition.bind(this)
        this.playTransition = this.playTransition.bind(this)
        this.durationList = this.props.chartList.map((c) => {return c.duration})
        this.delayList = this.props.chartList.map((c) => {return c.delay})
    }
    
    componentDidMount() {
        this.pathList.forEach((p, i) => {
            this.lengthList.push(p.getTotalLength())
        })

        this.totalLength = this.lengthList[this.lengthList.length - 1]
        d3.select(this.transPath)
        .attr("stroke-dasharray", this.totalLength)
    }

    playTransition(idx, partial) {
        if (!idx) idx = 1;
        let g = d3.select(this.transPath)
        this._playTransition(g, this, idx, partial)
    }
    
    _playTransition(g, that, idx, partial) {
        let startsAt = this.lengthList[idx - 1]
        let endsAt = this.lengthList[idx]
        if (!endsAt) return;
        g
            .attr("stroke-dashoffset", this.totalLength - startsAt)
            .transition()
            .delay(that.delayList[idx])
            .duration(that.durationList[idx])
            .attr("stroke-dashoffset", this.totalLength - endsAt)
            .on("end", function() {
                if (!partial) {
                    g.call(that._playTransition, that, idx + 1)
                }
            })
        
    }
    
    render() {
        const props = this.props;
        return (
            <Group>
                <LinePath 
                    innerRef={(node) => this.transPath = node}
                    data = {this.props.dataList[this.props.dataList.length - 1]}
                    xScale={props.xScale}
                    yScale={props.yScale}
                    x={props.x}
                    y={props.y}
                    stroke={props.stroke}
                />
                {this.props.dataList.map((d, i) => {
                    return (
                        <LinePath
                            key={i}
                            innerRef={(node) => this.pathList.push(node)}
                            data = {d}
                            xScale={props.xScale}
                            yScale={props.yScale}
                            x={props.x}
                            y={props.y}  
                            style={{display: "none"}}
                        />
                    )
                })}
            </Group> 
        )  
    } 
}