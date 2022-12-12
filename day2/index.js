const fs = require ('fs');
const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const rocks = ['A', 'X'];
const papers = ['B', 'Y'];
const scissors = ['C', 'Z'];

const conversion = {
    'A': 'X',
    'B': 'Y',
    'C': 'Z',
};

const wins = ['AY', 'BZ', 'CX'];
const draws = ['AX', 'BY', 'CZ'];
const losses = ['AZ', 'BX', 'CY'];

let round = 0;
let round2 = 0; 

function getMoveScore(move) {
    switch (move) {
        case rocks[1]:
            return 1;
        case papers[1]:
            return 2;
        case scissors[1]:
            return 3;
        default:
            return 0;
    }
}

function getRoundScore(move) {
    if (wins.indexOf(move) > -1) {
        return 6;
    } 
    
    if (draws.indexOf(move) > -1) {
        return 3;
    }

    return 0
}

data.split('\n').map((v, i) => {
    if (v === '') return;
    let move = v.split(' ').join('');

    round += getMoveScore(move[1]) + getRoundScore(move);

    switch (move[1]) {
        case 'Y': //draw
            move = move[0] + conversion[move[0]];
            break;
        case 'X': //lose
            move = move[0] + losses.filter(v => (new RegExp(`^${move[0]}`)).test(v))[0][1];
            break;
        default: //win
            move = move[0] + wins.filter(v => (new RegExp(`^${move[0]}`)).test(v))[0][1];
            break; 
    }
    
    round2 += getMoveScore(move[1]) + getRoundScore(move);
});

console.log('Part 1:', round);
console.log('Part 2:', round2);
