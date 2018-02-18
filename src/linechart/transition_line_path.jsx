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
        this._playLineTransition(g, this, idx, partial)
    }

    _glyphTransition(g, that, start, end, _delay) {
        let glyphs = that.glyphList.slice(start - 1, end)
        let single_delay = _delay / (end - start + 1)
        glyphs.forEach((d, i) => {
            d3.select(d)
                .transition()
                .duration(500)
                .delay(single_delay * i - 100)
                .style("opacity", 1)
                .attr("r", 3)
        })
    }

    _playLineTransition(g, that, idx, partial) {
        let startsAt = this.lengthList[idx - 1]
        let endsAt = this.lengthList[idx]
        if (!endsAt) return;
        let glyph_start = that.glyphCountList[idx - 1]
        let glyph_end = that.glyphCountList[idx]
        g.call(that._glyphTransition, that, glyph_start, glyph_end, that.delayList[idx])
        g
            .attr("stroke-dashoffset", this.totalLength - startsAt)
            .transition()
            .ease(d3.easeQuad)
            .duration(that.durationList[idx])
            .delay(that.delayList[idx])
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
                    strokeWidth={2.5}
                    glyph={(d, i) => {
                        let dot = 
                            <JiggleGlyph
                                innerRef={(node) => this.glyphList.push(node)}
                                className={"glyph-dots"}
                                key={`line-dot-${i}`}
                                cx={props.xScale(props.x(d))}
                                cy={props.yScale(props.y(d))}
                                r={3}
                                stroke={"steelblue"}
                                strokeWidth={2}
                                fill={"white"}
                                labelText={"TEXT"}
                                dx={3}
                                style={{opacity:0}}
                            >  
                            </JiggleGlyph>
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