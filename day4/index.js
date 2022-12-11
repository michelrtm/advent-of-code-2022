const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

let part1 = 0;
let part2 = 0;

data.split('\n').map((v,i) => {
    if (!v) return;
    const [first, second] = v.split(',');
    
    const [min1, max1] = first.split('-').map(v => Number(v));
    const [min2, max2] = second.split('-').map(v => Number(v));

    if ((min1 <= min2 && max1 >= max2) || (min2 <= min1 && max2 >= max1)) {
        part1++;
    } 

    if ((min2 <= max1 && min2 >= min1) || (min1 <= max2 && min1 >= min2)) {
        part2++;
    }
});

console.log('Part 1:', part1)
console.log('Part 2:', part2)
