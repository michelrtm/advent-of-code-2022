const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const message = data.split('\n')[0];

let start = 0;

while (start < message.length) {
    const sequence = message.substr(start, 4);

    const filtered = sequence.split('').filter((v,i,s) => {
        return s.indexOf(v) === i;
    });

    if (filtered.length === 4) {
        console.log('Part 1:', start + 4);
        break;
    }

    start += 1;
}

start = 0;

while (start < message.length) {
    const sequence = message.substr(start, 14);

    const filtered = sequence.split('').filter((v,i,s) => {
        return s.indexOf(v) === i;
    });

    if (filtered.length === 14) {
        console.log('Part 2:', start + 14);
        break;
    }

    start += 1;
}