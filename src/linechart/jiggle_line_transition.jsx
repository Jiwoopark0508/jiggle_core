import React from 'react'
// import { Group } from '@vx/group'
import Group from './meta-components/Group'
import { LinePath } from '@vx/shape'
// import { GridColumns } from '@vx/grid'
// import { GridRows } from '@vx/grid'
import { skeleton } from '../common/constant'
// import StripeColumns from './meta-components/stripe_columns'
import StripeRows from './meta-components/stripe_rows'
import TransitionLinePath from './transition_line_path'
import SmallTransitionLine from './transition_line_small'
import LargeTransitionLine from './transition_line_large'
import AxisLeft from './meta-components/AxisLeft'
import AxisBottom from './meta-components/AxisBottom'
import JiggleLabel from './jiggle_label';
import Header from './meta-components/Header'
import Footer from './meta-components/Footer'
import * as util from '../common/utils'
import _ from 'lodash'
import numeral from 'numeral'
import * as d3 from 'd3'
import { lineParser, access_gen } from '../parser/line-parser'

const LARGE = "LARGE"
const SMALL = "SMALL"
const PARTIAL = true

export default class JiggleLineTransition {
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
    getChildG(gParent) {
        console.log(this.header)
    }
    // Header
    _header(chartConfigs) {
        return (
            <Group
                top={20}
                left={15}
                className={"header"}
                innerRef={(node) => {this.header = node}}
            >
                <Header
                    configs={chartConfigs}
                    >
                </Header>
                {/* Place for Legend */}
            </Group>
        )
    }
    // Body
    _body(chartConfig, scale, processedData, labels) {
        let axis = this._axis(
            chartConfig, scale
        )
        let background = this._background(
            chartConfig, scale
        )
        let graph = this._graph(
            chartConfig, scale,
            processedData,
            labels
        )
        return (
            <Group
                className={"body"}
                innerRef={(node) => {this.body = node}}
                top={skeleton.height_header}
                left={skeleton.graph_margin.left}
            >
                {axis}
                {background}
                {graph}
            </Group>
        )
    }
    _graph(chartConfigs, scale, processedData, labels) {
        let lines = processedData.map((d, i) => {
            return (
                React.cloneElement(this.lineType,
                    {
                        key : i,
                        ref : (node) => {this.transPathLines.push(node)},
                        chartList : scale.chartList,
                        dataList : d,
                        x : scale.x,
                        y : scale.accessors[i + 1],
                        xScale : scale.xScale,
                        yScale : scale.yScale,
                        config : chartConfigs,

                    }
                )
            )
        })
        let annotations = labels.map((d, i) => {
            return (
                <JiggleLabel
                    key={`annotation-${i}`}
                    innerRef={(node) => this.annotationList.push(node)}
                    cx={scale.xScale(d.x)}
                    cy={scale.yScale(d.y)}
                    dx={d.dx}
                    dy={d.dy}
                    note={{title:d.y, comment:d.comment}}
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
    _background(chartConfigs, scale) {
        return (
            <Group>
                <StripeRows
                    scale={scale.yScale}
                    width={scale.xMax}
                    fill={chartConfigs.backgroundColor}
                    tickValues={scale.yTickValues}
                />
            </Group>
        )
    }
    _axis(chartConfigs, scale) {
        return (
            <Group>
                <AxisBottom
                    scale={scale.xScale}
                    top={scale.yMax}
                    stroke={chartConfigs.colorSecondary}
                    hideTicks={true}
                    numTicks={6}
                    tickLabelProps = {(tickValue, index) => ({
                        textAnchor: 'middle',
                        fontFamily: 'Spoqa Hans Regular',
                        fontSize: 14,
                        fill: '#7F7F7F',
                        dx: '2.2em',
                        dy: '0'
                    })}
                />
                <AxisLeft
                    scale={scale.yScale}
                    top={0}
                    left={0}
                    stroke={chartConfigs.colorSecondary}
                    hideTicks={true}
                    numTicks={4}
                    tickLabelProps = {(tickValue, index) => ({
                        textAnchor: 'middle',
                        fontFamily: 'Spoqa Hans Regular',
                        fontSize: 14,
                        fill: '#7F7F7F',
                        dx: '-1em',
                        dy: '-0.25em'
                    })}
                    tickValues={scale.yTickValues}
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
        
        if (this.modifiedState.annotations) annotations = this.modifiedState.annotations;
        // TODO --> Refactoring (set skeleton)
        const chartConfigs = this.getChartConfigs(chartList)
        const margin = skeleton.global_margin
        const width_g_total = chartConfigs.width_svg - margin.left - margin.right
        const height_g_total = chartConfigs.height_svg - margin.top - margin.bottom 

        const xMax = chartConfigs.width_svg - margin.left - margin.right - skeleton.graph_margin.left - skeleton.graph_margin.right
        const yMax = skeleton.height_body
        // By This line -- //

        const x = accessors[0]
        let yScaleDomain = []
        accessors.reduce((rec, d) => {
            return rec.concat(d)
        }, [])
        accessors.forEach((f, i) => {
            if (i < 1) return;
            yScaleDomain = yScaleDomain.concat(d3.extent(flatten_data, f))
        })
        yScaleDomain = d3.extent(yScaleDomain)
        
        let xScaleDomain = d3.extent(flatten_data, x)
        // xScaleDomain = util.padLineDomain(xScaleDomain)
        // let xScaleGraphDomain = padded xScaleDomain
        yScaleDomain = d3.extent(util.refineYAxis(yScaleDomain))
        const xScale = d3.scaleTime()
            .range([0, xMax])
            .domain(xScaleDomain)
        
        const yScale = d3.scaleLinear()
            .range([yMax, 0])
            .domain(yScaleDomain)
        
        const yTickValues = util.refineYAxis(yScaleDomain.slice())

        const scales = {
            xScale,
            yScale,
            yMax,
            xMax,
            header,
            accessors,
            x,
            chartList,
            yTickValues
        }
        
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
                {this._header(chartConfigs)}
                {this._body(chartConfigs, scales, processedData, annotations)}
                {this._footer(chartConfigs)}
            </Group>
        )
    }
}