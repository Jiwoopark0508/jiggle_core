import React from 'react'
import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import { AxisLeft, AxisBottom } from '@vx/axis'
import TransitionLinePath from './transition_line_path'
import _ from 'lodash'


import * as d3 from 'd3'

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

const x = d => new Date(d.date)
const y = d => d.close

const xMax = width - margin.left - margin.right
const yMax = height - margin.top - margin.bottom

export default class JiggleLineTransition extends React.Component {
    constructor(props) {
        super(props)
        this.transition = ""
        this.node = null
        this.fromChart = null
        this.toChart = null
        this.transPathLines = []
        this.chartList = []
        this.dataSeries = null
    }

    setFromToChart(fromChart, toChart) {
        this.fromChart = fromChart
        this.toChart = toChart
        let that = this;
        this.dataSeries = _.zip(this.fromChart.data, this.toChart.data)
    }
    
    playAllTransition(duration, delay) {
        let fromChart, toChart;
        let queue = []
        let accumedDelay = 0;
        process.nextTick(() => {
            for(let i = 0; i < this.chartList.length - 1; i++ ) {          
                fromChart = this.chartList[i]
                toChart = this.chartList[i + 1]
                queue.push({
                    from : fromChart.data,
                    to : toChart.data,
                    delay : toChart.delay,
                    duration : toChart.duration
                })
            }  
            queue.forEach((d, i) => {
                accumedDelay += d.delay
                setTimeout(() => {
                    this.transPathLines.forEach((l, i) => {
                            l.setPrevNextData(d.from[i],
                            d.to[i],
                            d.duration, 
                            d.delay)
                        })
                    }, accumedDelay )

                accumedDelay += d.duration;
            })

        })
    }

    renderTransition(config) {
        
        this.dataSeries = _.zip(this.fromChart.data,
                               this.toChart.data) 

        let flatten = this.toChart.data.reduce((rec, d) => {
                return rec.concat(d)
            }, [])
    
        let data = flatten.reduce((rec, d) => {
            return rec.concat(d)
        }, [])
    
        /**
         * Temporal scale and accessor
         */


        const x = d => new Date(d.date)
        const y = d => d.close
        const xScale = d3.scaleTime()
                .range([0, xMax])
                .domain(d3.extent(data, x))

        const yScale = d3.scaleLinear()
                .range([yMax, 0])
                .domain([0, d3.max(data, y)])

        // Temporal scale and accessor ends
        return (
            <g
                ref={(node) => this.domNode = node}>
                <rect x={0} y = {0} 
                    width={width}
                    height={height}
                    fill="#3e3e3e"/>
                
                <Group top={margin.top} left={margin.left}>
                    {this.dataSeries.map((d, i) => {
                        return (
                            <TransitionLinePath 
                                key={i}
                                ref={(node) => {this.transPathLines.push(node)}}
                                prevData={d[0]} // initial Data
                                nextData={d[1]}
                                x={x}
                                y={y}
                                // duration={config.duration}
                                // delay={config.delay}
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
                        stroke={'yellow'}
                        tickStroke='#f8f8f8'
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
                    stroke={'#f8f8f8'}
                    tickTextFill={'#f8f8f8'}
                    />

                </Group>
            </g>
        )
    }
}