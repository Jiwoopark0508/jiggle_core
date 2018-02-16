import React from 'react'
import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import { GridColumns } from '@vx/grid'
import { GridRows } from '@vx/grid'
import StripeColumns from './meta-components/stripe_columns'
import TransitionLinePath from './transition_line_path'
import AxisLeft from './meta-components/AxisLeft'
import AxisBottom from './meta-components/AxisBottom'
import Header from './meta-components/Header'
import _ from 'lodash'
import numeral from 'numeral'

import * as d3 from 'd3'
import { lineParser, access_gen } from '../parser/line-parser'

export default class JiggleLineTransition {
    constructor(charts) {
        this.transition = ""
        this.node = null
        this.transPathLines = []
        this.dataSeries = null
        this.chartList = charts
        this.dataCollection = _.map(this.chartList, (c) => {
            return c.data
        })
    }

    playWholeLineTransition(idx, partial, record) {
        if (record) {
            // Line Transition
            this.transPathLines.forEach((l, i) => {
                l.playTransition(idx, partial)
            })
        }
        else {
            // Glyph Transition
            // Glyph Transition Location
            // Line Transition
            process.nextTick(() => {
                this.transPathLines.forEach((l, i) => {
                    l.playTransition(idx, partial)
                })
            })
        }
    }

    renderTransitionLine(chartList) {
        /**
         * Data preprocessing
         */
        let parsedResult = lineParser(chartList)
        let processedData = parsedResult[0]

        let flatten_data = processedData.reduce((rec, d) => {
            return rec.concat(d)
        }, []).reduce((rec, d) => {
            return rec.concat(d)
        }, [])
        let accessors = parsedResult[1]
        let header = parsedResult[2]

        const width = 800
        const height = 500
        const margin = {
            top : 100,
            bottom : 60,
            left: 60,
            right : 60
        }

        const xMax = width - margin.left - margin.right
        const yMax = height - margin.top - margin.bottom
        
        const x = accessors[0]
        let y_extent = []
        accessors.reduce((rec, d) => {
            return rec.concat(d)
        }, [])
        accessors.forEach((f, i) => {
            if (i < 1) return;
            y_extent = y_extent.concat(d3.extent(flatten_data, f))
        })
        y_extent = d3.extent(y_extent)

        let xScaleDomain = d3.extent(flatten_data, x)
        
        const xScale = d3.scaleTime()
            .range([0, xMax])
            .domain(xScaleDomain)
        
        const yScale = d3.scaleLinear()
                .range([yMax, 0])
                .domain(y_extent)
        return (
            <g
                ref={(node) => this.domNode = node}>
                <rect x={0} y = {0} 
                    width={width}
                    height={height}
                    fill={"#f8f8f8"}/>
                <Group>
                    <Header
                        font-size={35}
                        >
                        {"타이틀 입니다."}
                    </Header>
                </Group>
                <Group top={margin.top} left={margin.left}>
                    <Group>
                        <StripeColumns
                            scale={xScale}
                            height={yMax}
                            numTicks={8}
                        />
                        <GridRows 
                            scale={yScale}
                            width={xMax}
                        />
                        <AxisBottom
                            scale={xScale}
                            top={yMax}
                            // rangePadding={100}
                            label={header[0]}
                            stroke={'#e2e2e2'}
                            hideTicks={true}
                            labelProps = {{
                                textAnchor: 'middle',
                                fontFamily: 'Arial',
                                fontSize: 10,
                                fill: '#2e2e2e',
                            }}
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
                            scale={yScale}
                            top={0}
                            left={0}
                            label={header[1]}
                            stroke={'#e2e2e2'}
                            hideTicks={true}
                            numTicks={4}
                            labelProps = {{
                                textAnchor: 'middle',
                                fontFamily: 'Arial',
                                fontSize: 10,
                                fill: '#2e2e2e',
                            }}
                            tickLabelProps = {(tickValue, index) => ({
                                textAnchor: 'middle',
                                fontFamily: 'Spoqa Hans Regular',
                                fontSize: 14,
                                fill: '#7F7F7F',
                                dx: '-0.25em',
                                dy: '-0.25em'
                            })}
                        />
                    </Group>
                    {processedData.map((d, i) => {
                        return (
                            <TransitionLinePath 
                                key={i}
                                ref={(node) => {this.transPathLines.push(node)}}
                                dataList={d}
                                chartList={chartList}
                                x={x}
                                y={accessors[i + 1]}
                                xScale={xScale}
                                yScale={yScale}
                            />
                            )
                        })
                    }
                    
                </Group>
            </g>
        )
    }
}