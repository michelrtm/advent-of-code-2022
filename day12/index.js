const fs = require('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const cleanData = data.split('\n').filter(v => v !== '');

const heightMap = [];

let start, end;

const startPositions = [];

cleanData.map((row, y) => {
    const values = row.split('');

    heightMap[y] = [];

    values.map((column, x) => {
        let cost = column.charCodeAt(0) - 96;

        if (column === 'S') {
            start = { x, y };
            cost = 0;
        }

        if (column === 'E') {
            end = { x, y };
            cost = 27
        }

        if (column === 'a' || column === 'S') {
            startPositions.push({x, y});
        }

        heightMap[y].push(cost);
    })
});

function run(positions) {
    let finalPosition;

    const visited = new Set();

    while (positions.length > 0) {
        const pos = positions.shift();
        const current = `${pos.x},${pos.y}`;

        if (visited.has(current)) {
            continue;
        }

        visited.add(current);

        if (pos.x === end.x && pos.y === end.y) {
            finalPosition = pos;
            break;
        }

        const cost = heightMap[pos.y][pos.x];

        let next;

        if (pos.y > 0 && heightMap[pos.y - 1][pos.x] - cost <= 1) {
            positions.push({
                x: pos.x,
                y: pos.y - 1,
                depth: pos.depth + 1,
            });
        }

        if (pos.y < heightMap.length - 1 && heightMap[pos.y + 1][pos.x] - cost <= 1) {
            positions.push({
                x: pos.x,
                y: pos.y + 1,
                depth: pos.depth + 1,
            });
        }

        if (pos.x > 0 && heightMap[pos.y][pos.x - 1] - cost <= 1) {
            positions.push({
                x: pos.x - 1,
                y: pos.y,
                depth: pos.depth + 1,
            });
        }

        if (pos.x < heightMap[0].length - 1 && heightMap[pos.y][pos.x + 1] - cost <= 1) {
            positions.push({
                x: pos.x + 1,
                y: pos.y,
                depth: pos.depth + 1,
            });
        }
    }

    return finalPosition;
}

const part1 = [
    {
        ...start,
        depth: 0,
    },
];

const finalP1 = run(part1);

console.log("Part 1:", finalP1?.depth);

const finalP2Positions = [];

startPositions.map(v => {
    const positions = [
        {
            ...v,
            depth: 0,
        }
    ];

    finalP2Positions.push(run(positions));
});

console.log("Part 2:", finalP2Positions.sort((a,b) => a.depth - b.depth)[0].depth);