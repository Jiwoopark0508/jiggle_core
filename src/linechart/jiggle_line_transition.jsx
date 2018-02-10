import React from 'react'
import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import { AxisLeft, AxisBottom } from '@vx/axis'
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
            this.transPathLines.forEach((l, i) => {
                l.playTransition(idx, partial)
            })
        }
        else {
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
        /**
         * Temporal and manual scale and accessor
         */

        // Variables which change with props later
        const width = 750
        const height = 400

        // Bounds

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
        
        const xScale = d3.scaleTime()
                .range([0, xMax])
                .domain(d3.extent(flatten_data, x))
        const yScale = d3.scaleLinear()
                .range([yMax, 0])
                .domain(y_extent).nice()

        return (
            <g
                ref={(node) => this.domNode = node}>
                <rect x={0} y = {0} 
                    width={width}
                    height={height}
                    fill={"#52B9EC"}/>
                
                <Group top={margin.top} left={margin.left}>
                    {processedData.map((d, i) => {
                        return (
                            <TransitionLinePath 
                                key={i}
                                ref={(node) => {this.transPathLines.push(node)}}
                                dataList={d}
                                chartList={chartList}
                                x={x}
                                y={accessors[i + 1]}ㅋ
                                xScale={xScale}
                                yScale={yScale}
                            />
                            )
                        })
                    }
                    <AxisLeft
                        scale={yScale}
                        top={0}
                        left={0}
                        label={'세로축'}
                        stroke={'white'}
                        tickStroke='white'
                        numTicks={4}
                        labelProps = {{
                            textAnchor: 'middle',
                            fontFamily: 'Arial',
                            fontSize: 10,
                            fill: 'white',
                        }}
                        tickLabelProps = {(tickValue, index) => ({
                            textAnchor: 'end',
                            fontFamily: 'Arial',
                            fontSize: 10,
                            fill: 'white',
                            dx: '-0.25em',
                            dy: '-0.25em'
                        })}
                    />
            
                    <AxisBottom
                        scale={xScale}
                        top={yMax}
                        label={'시간'}
                        stroke={'white'}
                        tickTextFill={'white'}
                        tickStroke='white'
                        numTicks={4}
                        labelProps = {{
                            textAnchor: 'middle',
                            fontFamily: 'Arial',
                            fontSize: 10,
                            fill: 'white',
                        }}
                        tickLabelProps = {(tickValue, index) => ({
                            textAnchor: 'end',
                            fontFamily: 'Arial',
                            fontSize: 10,
                            fill: 'white',
                            dx: '-0.25em',
                            dy: '-0.25em'
                        })}
                    />

                </Group>
            </g>
        )
    }
}