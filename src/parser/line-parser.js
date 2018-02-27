/**
 * Preprocessing data for line chart
 */
import _ from "lodash";
import moment from "moment";
import numeral from "numeral";

function keyParse(time) {
    if (moment(time).isValid()) return moment(time)
    return time
}

function accessor_generator(header) {
    return _.map(header, (h, i) => {
        return x => x[h];
    });
}

function label_generator(labels, data) {
    let obj = {};
    let ret = [];
    labels = _.sortBy(labels, function(o) {
        if(o.comment) return o.row;
    });
    labels.forEach(function(d) {
        obj = {
            y: numeral(data[d.row][d.col]).value(),
            x: moment(data[d.row][0]),
            comment: d.comment,
            dx: 30,
            dy: -30
        };
        ret.push(obj);
    });
    return ret;
}

function lineParser(chartList) {
    let result = [];
    // get chartList parse data
    let err = true;
    let dataList = _.map(chartList, (c, i) => {
        return c.rawData;
    });
    let header = dataList[0][0];
    for (var i = 0; i < dataList.length; i++) {
        let single_column = dataList[i];
        let obj_wrapped = _.map(single_column, (row, i) => {
            let key = null;
            let row_wrapped = _.map(row, (d, i) => {
                if (i < 1) {
                    key = keyParse(d);
                }
                let obj = {};
                obj[header[0]] = key;
                obj[header[i]] = numeral(d).value();
                return obj;
            });
            return row_wrapped.slice(1);
        });

        result.push(_.zip.apply(_, obj_wrapped.slice(1)));
    }
    result = _.zip.apply(_, result);
    result.forEach((line, i) => {
        line.forEach((data, i) => {
            data = _.sortBy(data, header[0]);
        });
    });

    let accessors = accessor_generator(header);
    let annotations = label_generator(
        chartList[0].label,
        dataList[dataList.length - 1]
    );
    return { result, accessors, header, annotations };
}
export { lineParser };
