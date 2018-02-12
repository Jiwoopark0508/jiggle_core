/**
 * Preprocessing data for line chart
 */
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'

function keyParse(time) {
    return moment(time)
}

function accessor_generator(header) {
    return _.map(header, (h, i) => {
        return x => x[h]
    })
}

function lineParser(chartList) {
    let result = []
    // get chartList parse data
    let err = true;
    
    let dataList = _.map(chartList, (c, i) => {
        return c.data
    })
    let header = dataList[0][0]
    console.log(header)
    for(var i = 0; i < dataList.length; i++) {
        let single_column = dataList[i]
        let obj_wrapped = _.map(
            single_column,
            (row, i) => {
                let key = null
                let row_wrapped = _.map(row, (d, i) => {
                    if (i < 1) {
                        key = keyParse(d)
                    }
                    let obj = {}
                    obj[header[0]] = key
                    obj[header[i]] = numeral(d).value()
                    return obj
                })
                return row_wrapped.slice(1)
        })

        result.push(_.zip.apply(_, obj_wrapped.slice(1)))
    }
    result = _.zip.apply(_, result) 
    result.forEach((line, i) => {
        line.forEach((data, i) => {
            data = _.sortBy(data, header[0])
            console.log(data)
        })
    })

    let accessors = accessor_generator(header)
    return [result, accessors]
}
export { lineParser };