const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const operations = [];

const cleanData = data.split('\n').filter(v => v !== '');

cleanData.map((v,i) => {
    let [operation, value] = v.split(' ');

    let op = {
        name: operation,
        ticks: operation === 'noop' ? 1 : 2,
        value: value ? Number.parseInt(value) : 0,
    };

    operations.push(op);
});

let tick = 0;

let current, next;

const x = [
    1
];

while (operations.length > 0 || current) {
    if (!current) {
        current = operations.shift();
    }

    if (current.ticks - 1 === 0) {
        x.push(x[x.length - 1] + current.value);
    } else {
        x.push(x[x.length - 1]);
    }

    tick++;

    if (current.ticks > 0) {
        current.ticks--;
    }

    if (current.ticks === 0) {
        current = undefined;
    }
}

let signalStrength = 0;

const toCalculate = [20, 60, 100, 140, 180, 220];

x.map((v,i) => {
    if (toCalculate.indexOf(i + 1) > -1) {
        signalStrength += (i + 1) * v;
    }

});

console.log('Part 1: ', signalStrength);

const width = 40, height = 6;

const chars = [];

let row = 0;
let pixel = 0;

x.map(v => {
    if (row >= height) {
        return;
    }

    if (!chars[row]) {
        chars[row] = '';
    }

    const spritePosition = [v - 1, v, v + 1];

    chars[row] += spritePosition.indexOf(pixel) > -1 ? '#' : '.';
    
    pixel++;

    if (pixel === width) {
        pixel = 0;
        row++;
    }
});

console.log('Part 2: ', chars)