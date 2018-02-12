/* Although its name is linechart_transition 
 * Its role is to take two data input and make it transition.
 * Maybe it is proper to name it as *transition linepath*
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import JiggleGlyph from './jiggle_glyph';
import _ from 'lodash'
import * as d3 from 'd3'

export default class TransitionLinePath extends React.Component {
    constructor(props){
        super(props)
        this.pathList = []
        this.lengthList = []
        this.glyphList = []
        this.transPath = null
        this._playLineTransition = this._playLineTransition.bind(this)
        // this._glyphTransition = this._glyphTransition.bind(this)
        this.playTransition = this.playTransition.bind(this)
        this.durationList = this.props.chartList.map((c) => {return c.duration})
        this.delayList = this.props.chartList.map((c) => {return c.delay})

        this.glyphCountList = _.map(this.props.dataList, (d, i) =>{
            return d.length;
        })
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
        // this._glyphTransition(g, this, 0, 6)
        this._playLineTransition(g, this, idx, partial)
    }

    _glyphTransition(g, that, start, end) {
        // from start to end give transition
        let glyphs = that.glyphList.slice(start - 1, end)
        glyphs.forEach((d, i) => {
            d3.select(d)
                .transition()
                .duration(500 * i)
                .style("opacity", 1)
                .attr("r", 4)
        })
    }

    _playLineTransition(g, that, idx, partial) {
        let startsAt = this.lengthList[idx - 1]
        let endsAt = this.lengthList[idx]
        if (!endsAt) return;
        let glyph_start = that.glyphCountList[idx - 1]
        let glyph_end = that.glyphCountList[idx]
        g.call(that._glyphTransition, that, glyph_start, glyph_end)
        g
            .attr("stroke-dashoffset", this.totalLength - startsAt)
            .transition()
            .delay(that.delayList[idx])
            .duration(that.durationList[idx])
            .attr("stroke-dashoffset", this.totalLength - endsAt)
            .on("end", function() {
                if (!partial) {
                    g.call(that._playLineTransition, that, idx + 1)
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
                    glyph={(d, i) => {
                        let dot = <JiggleGlyph
                            innerRef={(node) => this.glyphList.push(node)}
                            className={"glyph-dots"}
                            key={`line-dot-${i}`}
                            cx={props.xScale(props.x(d))}
                            cy={props.yScale(props.y(d))}
                            r={3}
                            stroke={"steelblue"}
                            strokeWidth={2}
                            fill={"white"}
                            style={{opacity : 0}}
                        />
                        return dot;
                    }}
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