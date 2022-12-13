const fs = require('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const cleanData = data.split(/\n\n/);

const alreadyOrdered = [];

function checkOrder(leftValues, rightValues, depth = 0) {
    while (leftValues.length > 0 && rightValues.length > 0) {
        const left = leftValues.shift();
        const right = rightValues.shift();

        if (typeof left === 'number' && typeof right === 'number') {
            if (left < right) {
                return true;
            }

            if (left > right) {
                return false;
            }
        } else if (left instanceof Array && right instanceof Array) {
            const isOrdered = checkOrder(left, right, ++depth);

            if (typeof isOrdered === 'boolean') {
                return isOrdered;
            }
        } else if (typeof left === 'number' && right instanceof Array) {
            const isOrdered = checkOrder([left], right, ++depth);

            if (typeof isOrdered === 'boolean') {
                return isOrdered;
            }
        } else if (left instanceof Array && typeof right === 'number') {
            const isOrdered = checkOrder(left, [right], ++depth);

            if (typeof isOrdered === 'boolean') {
                return isOrdered;
            }
        }
    }

    if (leftValues.length) {
        return false;
    }

    if (rightValues.length) {
        return true;
    }
}

//part 1
cleanData.map((v, i) => {
    const [left, right] = v.split('\n');

    const leftParsed = JSON.parse(left);
    const rightParsed = JSON.parse(right);

    const isOrdered = checkOrder(leftParsed, rightParsed, 1);

    if (isOrdered) {
        alreadyOrdered.push(i + 1);
    }
});

//part 2
let rows = data.split('\n').filter(v => v !== '');

const firstDivider = '[[2]]';
const secondDivider = '[[6]]';

rows.push(firstDivider);
rows.push(secondDivider);

rows.sort((a,b) => { 
    return checkOrder(JSON.parse(a), JSON.parse(b)) ? -1 : 1
});

const firstDividerIndex = rows.indexOf(firstDivider) + 1;
const secondDividerIndex = rows.indexOf(secondDivider) + 1;

console.log('Part 1:', alreadyOrdered.length ? alreadyOrdered.reduce((p, c) => p + c) : 0)
console.log('Part 2:', firstDividerIndex * secondDividerIndex)