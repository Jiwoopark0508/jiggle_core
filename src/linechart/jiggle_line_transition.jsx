import React from 'react'
import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import { AxisLeft, AxisBottom } from '@vx/axis'
import { GridColumns } from '@vx/grid'
import StripeColumns from './meta-components/stripe_columns'
import TransitionLinePath from './transition_line_path'
import _ from 'lodash'
import moment from 'moment'
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

        const width = 750
        const height = 400
        const margin = {
            top : 60,
            bottom : 60,
            left: 80,
            right : 80
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
            .domain(xScaleDomain).nice()
        
        const yScale = d3.scaleLinear()
                .range([yMax, 0])
                .domain(y_extent).nice()
        return (
            <g
                ref={(node) => this.domNode = node}>
                <rect x={0} y = {0} 
                    width={width}
                    height={height}
                    fill={"#f8f8f8"}/>
                
                <Group top={margin.top} left={margin.left}>
                    <Group>
                        <StripeColumns
                            scale={xScale}
                            height={yMax}
                            numTicks={8}
                        />
                        <AxisBottom
                            scale={xScale}
                            top={yMax}
                            label={header[0]}
                            stroke={'#e2e2e2'}
                            numTicks={4}
                            hideTicks={true}
                            labelProps = {{
                                textAnchor: 'middle',
                                fontFamily: 'Arial',
                                fontSize: 10,
                                fill: '#2e2e2e',
                            }}
                            tickLabelProps = {(tickValue, index) => ({
                                textAnchor: 'end',
                                fontFamily: 'Arial',
                                fontSize: 10,
                                fill: '#2e2e2e',
                                dx: '-0.25em',
                                dy: '-0.25em'
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
                                textAnchor: 'end',
                                fontFamily: 'Arial',
                                fontSize: 10,
                                fill: '#2e2e2e',
                                dx: '-0.25em',
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