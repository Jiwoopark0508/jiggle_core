import moment from 'moment'
import _ from 'lodash'

function divideArray(n) {
    let first = this[0]
    let last = this[this.length - 1]
    let interval = 0;
    if(typeof(first) == "object") {
        let moFirst = moment(first)
        let moLast = moment(last)
        
        interval = moLast.diff(moFirst) / 3
        this.splice(1, 0, moFirst.add(interval))
        this.splice(2, 0, moLast.subtract(interval))
        return this
    } else {
        interval = (last - first ) / 3
        this.splice(1, 0, first + interval)
        this.splice(2, 0, last - interval)
        return this
    }



}

export { divideArray }