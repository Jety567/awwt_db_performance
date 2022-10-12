const fs = require('fs');


let mongo = JSON.parse(fs.readFileSync('../mongo/perf.json'));
let maria = JSON.parse(fs.readFileSync('../maria/perf.json'));

fs.writeFileSync('avg.json',JSON.stringify({
    mongo: avg(mongo),
    maria: avg(maria),
}));

function avg(array) {
    let array_avg = array[0];

    for (let i = 1; i < array.length; i++) {
        let keys_1 = Object.keys(array[i]);
        for (let j = 0; j < keys_1.length; j++) {
            let keys_2 = Object.keys(array[i][keys_1[j]]);
            for (let k = 0; k < keys_2.length; k++) {
                array_avg[keys_1[j]][keys_2[k]] = array_avg[keys_1[j]][keys_2[k]] + array[i][keys_1[j]][keys_2[k]];
            }
        }
    }
    let keys_1 = Object.keys(array_avg);
    for (let j = 0; j < keys_1.length; j++) {
        let keys_2 = Object.keys(array_avg[keys_1[j]]);
        for (let k = 0; k < keys_2.length; k++) {
            array_avg[keys_1[j]][keys_2[k]] = array_avg[keys_1[j]][keys_2[k]]/array.length;
        }
    }

    return array_avg;
}