const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const cleanData = data.split('\n').filter(v => v !== '');

const knots = [];
const visited = [];

const totalKnots = 10;

for (let i = 0; i < totalKnots; i++) {
    knots.push({
        x:0,
        y:0
    });

    visited.push((new Set()).add('0,0'));
}

cleanData.map((v, row)  => {
    const [direction, distance] = v.split(' ');

    for (let i = 0; i < distance; i++) {
        if (direction === 'R' || direction === 'L') {
            knots[0].x = knots[0].x + (direction === 'R' ? 1 : -1);
        }

        if (direction === 'U' || direction === 'D') {
            knots[0].y = knots[0].y + (direction === 'D' ? 1 : -1);
        }

        for (let tail = 1; tail < knots.length; tail++) {
            knots[tail] = moveTail(knots[tail].x, knots[tail].y, knots[tail - 1].x, knots[tail - 1].y);
        
            if (!visited[tail].has(`${knots[tail].x},${knots[tail].y}`)) {
                visited[tail].add(`${knots[tail].x},${knots[tail].y}`);
            }
        }
    }
});

function moveTail(tailX, tailY, headX, headY) {
    if (Math.abs(tailX - headX) < 2 && Math.abs(tailY - headY) < 2) {
        return {x: tailX, y: tailY};
    }

    if (tailX !== headX) {
        tailX += tailX > headX ? -1 : 1
    }

    if (tailY !== headY) {
        tailY += tailY > headY ? -1 : 1
    }

    return {
        x: tailX,
        y: tailY,
    }
}

console.log('Part 1:', visited[1].size);
console.log('Part 2:', visited[Object.keys(visited).length - 1].size);