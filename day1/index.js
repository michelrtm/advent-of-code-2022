const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const split = data.split('\n');

const totals = [];

let elf = 0;

split.map((v, i) => {
    if (!Object.prototype.hasOwnProperty.call(totals, elf)) {
        totals[elf] = 0;
    } 

    if (v === '') {
        elf++;
        return;
    }

    totals[elf] += parseInt(v);
});

const mapped = totals.map((v,i) => {
    return {index: i, value: v}
}).sort((a,b) => b.value - a.value);


console.log(`Part 1: ${mapped[0].value}`);
console.log(`Part 2: ${mapped[0].value + mapped[1].value + mapped[2].value}`);
