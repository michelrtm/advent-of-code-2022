const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const columns = [];
const columns2 = [];

const moves = [];

data.split('\n').map((v, i) => {
    if (/^\s1/.test(v) || v.trim() === '' || v.trim().length === 0) return;

    if (/^move/.test(v) === true) {
        moves.push(v);
        return;
    }

    let start = 0;
    let it = 0;

    while (start < v.length) {
        if (!columns[it]) {
            columns[it] = [];
            columns2[it] = [];
        }

        const value = v.slice(start, start + 3);

        if(value.trim() === '') { 
        
            start += 4;
            it++;
            continue;
        }

        columns[it].unshift(value.replace('[', '').replace(']', ''));
        columns2[it].unshift(value.replace('[', '').replace(']', ''));

        start += 4;
        it++;
    }
});

moves.map((v, i) => {
    let movesCount = Number(v.split(' ')[1]);
    let start = Number(v.split(' ')[3]) - 1;
    let end = Number(v.split(' ')[5]) - 1;

    let part2Moves = [];

    for (let idx = 0; idx < movesCount; idx++) {
        columns[end].push(columns[start].pop());

        //part2
        part2Moves.unshift(columns2[start].pop());
    }
    
    for (let j of part2Moves) {
        columns2[end].push(j);
    }
});

const part1 = [];

for (const row of columns) {
    part1.push(row[row.length - 1]);
}

console.log('Part 1:', part1.join(''))

const part2 = [];

for (const row of columns2) {
    part2.push(row[row.length - 1]);
}

console.log('Part 2:', part2.join(''))
