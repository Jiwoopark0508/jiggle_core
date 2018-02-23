import React from 'react'
import { LinePath } from '@vx/shape'
import { skeleton, GRAPH_COLOR } from '../common/constant'
import StripeRows from './meta-components/stripe_rows'
import TransitionLinePath from './transition_line_path'
import SmallTransitionLine from './transition_line_small'
import LargeTransitionLine from './transition_line_large'
import AxisBottom from './meta-components/AxisBottom'
import JiggleLabel from './jiggle_label';
import Group from './meta-components/Group'
import AxisLeft from './meta-components/AxisLeft'
import Header from './meta-components/Header'
import Legend from './meta-components/Legend'
import Footer from './meta-components/Footer'
import Image from './meta-components/Image'
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
    date = moment(date).format(`YYYY년 M월DD일`)
    return date.split(' ')
}

export default class JiggleLine {
    constructor(charts, type) {
        this.transition = ""
        this.node = null
        this.transPathLines = []
        this.dataSeries = null
        this.chartList = charts
        this.lineType = this.setLineType(type)
        this.modifiedState = {}
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
    playWholeLineTransition(idx, partial, record) {
        if (record) { // Record Transition
            this.transPathLines.forEach((l, i) => {
                l.playTransition(idx, partial)
            })
            this.labelTransition(idx, PARTIAL)
        }
        else { // Preview Transition
            process.nextTick(() => {
                this.transPathLines.forEach((l, i) => {
                    l.playTransition(idx, partial)
                })
                this.labelTransition(1, !PARTIAL)
            })
        }
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
        let image = this._image()
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
                    imageList={Mario}
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
                    // stroke={chartConfigs.graph_colors[i]}
                    note={{title:d.y, comment:d.value}}
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
            </Group>)
    }

    renderTransitionLine(chartList) {
        /**
         * Data preprocessing
         */
        let parsedResult = lineParser(chartList)
        let processedData = parsedResult.result

        let flatten_data = processedData.reduce((rec, d) => {
            return rec.concat(d)
        }, []).reduce((rec, d) => {
            return rec.concat(d)
        }, [])
        let accessors = parsedResult.accessors
        let header = parsedResult.header
        let annotations = parsedResult.annotations
        
        // TODO --> Refactoring (set skeleton)
        const chartConfigs = this.getChartConfigs(chartList)
        chartConfigs.graph_colors = GRAPH_COLOR
        const margin = skeleton.global_margin
        const width_g_total = chartConfigs.width_svg - margin.left - margin.right
        const height_g_total = chartConfigs.height_svg - margin.top - margin.bottom 

        const xMax = chartConfigs.width_svg - margin.left - margin.right - skeleton.graph_margin.left - skeleton.graph_margin.right
        const yMax = skeleton.height_body
        // By This line -- //

        const x = accessors[0]
        let flattenY = []
        accessors.reduce((rec, d) => {
            return rec.concat(d)
        }, [])
        accessors.forEach((f, i) => {
            if (i < 1) return;
            flattenY = flattenY.concat(d3.extent(flatten_data, f))
        })

        let xScaleDomain = d3.extent(flatten_data, x)
        let yScaleDomain = d3.extent(util.refineYAxis(flattenY.slice()))

        const xScale = d3.scaleTime()
            .range([0, xMax])
            .domain(xScaleDomain)
            
        const yScale = d3.scaleLinear()
            .range([yMax, 0])
            .domain(yScaleDomain)
        
        const yTickValues = util.refineYAxis(flattenY.slice())
        const xTickValues = util.refineXAxis(xScaleDomain.slice())
        
        const scales = {
            xScale,
            yScale,
            yMax,
            xMax,
            header,
            accessors,
            x,
            chartList,
            yTickValues,
            xTickValues,
            annotations
        }
        const chartConfig = Object.assign({}, chartConfigs, scales)
        return (
            <Group
                className="total"
                top={skeleton.global_margin.top}
                left={skeleton.global_margin.left} 
                innerRef={(node) => this.domNode = node}>
                <rect
                    x={-skeleton.global_margin.left} y = {-skeleton.global_margin.top} 
                    width={chartConfigs.width_svg}
                    height={chartConfigs.height_svg}
                    fill={chartConfigs.backgroundColor}/>        
                {this._header(chartConfig)}
                {this._body(chartConfig, processedData, annotations)}
                {this._footer(chartConfig)}
            </Group>
        )
    }
}