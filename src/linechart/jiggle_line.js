import React from 'react'
import { LinePath } from '@vx/shape'
import { skeleton, GRAPH_COLOR } from '../common/constant'
import SmallTransitionLine from './transition_line_small'
import LargeTransitionLine from './transition_line_large'
import JiggleLabel from './jiggle_label';
import StripeRows from './meta-components/stripe_rows'
import Group from './meta-components/Group'
import AxisBottom from './meta-components/AxisBottom'
import AxisLeft from './meta-components/AxisLeft'
import Header from './meta-components/Header'
import Legend from './meta-components/Legend'
import Footer from './meta-components/Footer'
import Image from './meta-components/Image'
import ProgressBar from './meta-components/ProgressBar'
import Mario from '../data/image-mario'
import * as util from '../common/utils'
import _ from 'lodash'
import numeral from 'numeral'
import moment from 'moment'
import * as d3 from 'd3'
import { lineParser, access_gen } from '../parser/line-parser'

const LARGE = "LARGE"
const SMALL = "SMALL"
const PARTIAL = true

function formatDate(date, idx) {
    let momentDate = moment(date)
    if (momentDate.isValid()) {
        date = moment(date).format(`YYYY년 M월DD일`)
        return date.split(' ')
    }
    return date
}

export default class JiggleLine {
    constructor(charts, images, type) {
        this.transition = ""
        this.node = null
        this.transPathLines = []
        this.dataSeries = null
        this.chartList = charts
        this.total_duration = _.reduce(
            this.chartList,
            (sum, cht) => { 
                return (sum += cht.duration + cht.delay)
            },
            0
        )
        this.lineType = this.setLineType(type)
        this.images = images
        this.annotationList = [null]
    }

    setLineType(type) {
        if (type == SMALL) {
            return (<SmallTransitionLine />)
        } else if (type == LARGE) {
            return (<LargeTransitionLine />)
        }
    }
    setSkeleton(chartConfig) {
        const height_header = 115
        const height_body = 345
        const height_footer = 60
        return {
            height_header,
            height_body,
            height_footer
        }
    }
    drawGlyphLabel(){
        process.nextTick(() => {
            this.transPathLines.forEach((tline) => {
                tline.glyphList.forEach((g) => {
                    d3.select(g)
                        .style("opacity", "1")
                })
            })
            this.annotationList.forEach((annotation) => {
                console.log("!")
            })
        })
    }
    playWholeLineTransition(idx, partial, record) {
        if (record) { // Record Transition
            this.transPathLines.forEach((l, i) => {
                l.playTransition(idx, partial)
            })
            this.labelTransition(idx, PARTIAL)
            this.progressBarTransition(idx, PARTIAL)
        }
        else { // Preview Transition
            process.nextTick(() => {
                this.transPathLines.forEach((l, i) => {
                    l.playTransition(idx, partial)
                })
                this.labelTransition(1, !PARTIAL)
                this.progressBarTransition(1, !PARTIAL)
            })
        }
    }
    progressBarTransition(idx, partial) {
        console.log(this.chartList[idx])
        if(!this.chartList[idx]) return;
        const WIDTH = 1080
        let delay = this.chartList[idx].delay
        let duration = this.chartList[idx].duration
        let prevDuration = _.reduce(this.chartList.slice(0, idx),
            (sum, cht) => { return sum += cht.duration + cht.delay }, 0
        )
        let nextDuration = _.reduce(this.chartList.slice(0, idx + 1),
            (sum, cht) => { return sum += cht.duration + cht.delay }, 0
        )
        d3.select(this.progressbar)
            .attr("width", WIDTH * prevDuration / this.total_duration)
            .transition()
            .ease(d3.easeLinear)
            .duration(duration + delay)
            .attr("width", WIDTH * nextDuration / this.total_duration)
            .on("end", () => {
                if(!partial){
                    this.progressBarTransition(idx + 1, !PARTIAL)
                }
            })

    }
    labelTransition(idx, partial) {
        if(!this.chartList[idx]) return;
        let elem = this.annotationList[idx]
        let delay = this.chartList[idx].delay
        let duration = this.chartList[idx].duration
        d3.select(elem)
            .transition()
            .duration(duration)
            .delay(delay)
            .attr("transform", "scale(1)")
            .on("end", () => {
                if(!partial){
                    this.labelTransition(idx + 1, !PARTIAL)
                }
            })
    }
    getChartConfigs(chartList) {
        return chartList[0]
    }
    // Header
    _header(chartConfig) {
        return (
            <Group
                top={20}
                left={15}
                className={"title"}
                innerRef={(node) => {this.header = node}}
            >
                <Header
                    configs={chartConfig}
                    >
                </Header>
                <Legend
                    className="legend"
                    left={800}
                    configs={chartConfig}
                    headers={chartConfig.header}
                >
                </Legend>
            </Group>
        )
    }
    // Body
    _body(chartConfig, processedData, labels) {
        let axis = this._axis(
            chartConfig
        )
        let background = this._background(
            chartConfig
        )
        let graph = this._graph(
            chartConfig,
            processedData,
            labels
        )
        let image = this._image(this.images)
        return (
            <Group
                className={"body"}
                innerRef={(node) => {this.body = node}}
                top={skeleton.height_header}
                left={skeleton.graph_margin.left}
            >
                {axis}
                {background}
                {image}
                {graph}
            </Group>
        )
    }
    _image(imageList) {
        return (
            <Group
                top={-155}
                left={-220}
                className={"image"}
            >
                <Image 
                    imageList={imageList}
                />
            </Group>
        )
    }
    _graph(chartConfig, processedData, labels) {
        let lines = processedData.map((d, i) => {
            return (
                React.cloneElement(this.lineType,
                    {
                        key : i,
                        ref : (node) => {this.transPathLines.push(node)},
                        chartList : chartConfig.chartList,
                        dataList : d,
                        x : chartConfig.x,
                        y : chartConfig.accessors[i + 1],
                        xScale : chartConfig.xScale,
                        yScale : chartConfig.yScale,
                        config : chartConfig,
                        color : chartConfig.graph_colors[i]
                    }
                )
            )
        })
        let annotations = labels.map((d, i) => {
            return (
                <JiggleLabel
                    key={`annotation-${i}`}
                    innerRef={(node) => this.annotationList.push(node)}
                    cx={chartConfig.xScale(d.x)}
                    cy={chartConfig.yScale(d.y)}
                    dx={d.dx}
                    dy={d.dy}
                    stroke={chartConfig.colorSecondary}
                    note={{title:d.x, comment:d.comment}}
                />
            )
        })
        return (
            <Group
                className={"graph"}
                >
                {lines}
                {annotations}
            </Group>
        )
    }
    _background(chartConfig) {
        return (
            <Group
                className={"background"}
            >
                <StripeRows
                    scale={chartConfig.yScale}
                    width={chartConfig.xMax}
                    fill={chartConfig.backgroundColor}
                    tickValues={chartConfig.yTickValues}
                />
            </Group>
        )
    }
    _axis(chartConfig) {
        return (
            <Group
                className={"axis"}
            >
                <AxisBottom
                    scale={chartConfig.xScale}
                    top={chartConfig.yMax}
                    stroke={chartConfig.colorSecondary}
                    hideTicks={true}
                    numTicks={100}
                    tickLabelProps = {(tickValue, index) => ({
                        textAnchor: 'start',
                        fontFamily: 'Spoqa Hans',
                        fontWeight: 400,
                        fontSize: 14,
                        fill: '#7F7F7F',
                        dx: '2.2em',
                        dy: '0'
                    })}
                    tickValues={chartConfig.xTickValues}
                    tickFormat={formatDate}
                />
                <AxisLeft
                    scale={chartConfig.yScale}
                    top={0}
                    left={0}
                    stroke={chartConfig.colorSecondary}
                    hideTicks={true}
                    numTicks={4}
                    tickLabelProps = {(tickValue, index) => ({
                        textAnchor: 'middle',
                        fontFamily: 'Spoqa Hans',
                        fontSize: 14,
                        fill: '#7F7F7F',
                        dx: '-1em',
                        dy: '-0.25em'
                    })}
                    tickValues={chartConfig.yTickValues}
                />
            </Group>
        )
    }
    // Footer
    _footer(chartConfig) {
        return (
            <Group
                className="footer"
                top={chartConfig.height_svg - skeleton.height_footer - skeleton.global_margin.bottom}
                >
                <Footer 
                    configs={chartConfig}
                />
                <ProgressBar
                    innerRef={(node) => this.progressbar = node}
                />
            </Group>)
    }
    renderLine(chart, innerRef) {
        let chartConfig = null;
        if (chart instanceof Array) {
            chartConfig = util.processChartConfig(chart)
        } else {
            chart = [chart]
            chartConfig = util.processChartConfig(chart)
        }
        console.log(chartConfig)
        return (
            <Group
                className="total"
                top={chartConfig.global_margin.top}
                left={chartConfig.global_margin.left} 
                innerRef={(node) => {this.gParent = node}}
            >
                <rect
                    x={-chartConfig.global_margin.left} y = {-chartConfig.global_margin.top} 
                    width={chartConfig.width_svg}
                    height={chartConfig.height_svg}
                    fill={chartConfig.theme.backgroundColor}/>        
                {this._header(chartConfig)}
                {this._body(chartConfig, chartConfig.processedData, chartConfig.annotations)}
                {this._footer(chartConfig)}
            </Group>
        )
    }

    // renderTransitionLine(chartList) {
    //     const chartConfig = util.processChartConfig(chartList)
    //     return (
    //         <Group
    //             className="total"
    //             top={chartConfig.global_margin.top}
    //             left={chartConfig.global_margin.left} 
    //             innerRef={(node) => this.domNode = node}>
    //             <rect
    //                 x={-chartConfig.global_margin.left} y = {-chartConfig.global_margin.top} 
    //                 width={chartConfig.width_svg}
    //                 height={chartConfig.height_svg}
    //                 fill={chartConfig.backgroundColor}/>        
    //             {this._header(chartConfig)}
    //             {this._body(chartConfig, chartConfig.processedData, chartConfig.annotations)}
    //             {this._footer(chartConfig)}
    //         </Group>
    //     )
    // }
}