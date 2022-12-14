const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const testData = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const cleanData = data.split('\n').filter(v => v !== '');

const sandStart = {
    x: 500,
    y: 0,
    value: '+',
};

let minPos = {
    x: undefined,
    y: undefined,
};

let maxPos = {
    x: undefined,
    y: undefined,
};

const obstacles = ['#', 'o'];

function getPositions(cleanData) {
    const positions = [];
    
    positions.push(sandStart);
    
    cleanData.map((v, row) => {
        const points = v.split(' -> ');
    
        positions[row] = [];
    
        let from;
    
        points.map((point, pIndex) => {
            const [x, y] = point.split(',');
    
            let to = { 
                x: Number.parseInt(x), 
                y: Number.parseInt(y),
                value: '#',
            };
    
            positions[row].push(to);
            
            updateMinMaxPos(to);
    
            if (from) {
                let currentX = from.x;
                let currentY = from.y;
    
                while (currentX !== to.x || currentY !== to.y) {
                    if (currentX < to.x || currentX > to.x) {
                        currentX = currentX + (currentX < to.x ? 1 : -1)
                    }
    
                    if (currentY < to.y || currentY > to.y) {
                        currentY = currentY + (currentY < to.y ? 1 : -1)
                    }
    
                    positions[row].push({
                        x: currentX,
                        y: currentY,
                        value: '#',
                    });
                }
            }
    
            from = to;
        });
    });

    return positions;
};

function updateMinMaxPos(position) {
    if (!maxPos.x || position.x > maxPos.x) {
        maxPos.x = position.x;
    }
    
    if (!maxPos.y || position.y > maxPos.y) {
        maxPos.y = position.y;
    }
    
    if (!minPos.x || position.x < minPos.x) {
        minPos.x = position.x;
    }
    
    if (!minPos.y || position.y < minPos.y) {
        minPos.y = position.y;
    }
}

function getMap(original) {
    let positions = original.map(v => [...v]);

    const map = [];

    while (positions.length > 0) {
        const rowPositions = positions.shift();

        for (let position of rowPositions) {
            if (!map[position.y]) {
                map[position.y] = [];
            }

            map[position.y][position.x] = position.value;
        }
    }

    if (!map[sandStart.y]) {
        map[sandStart.y] = [];
    }
    
    map[sandStart.y][sandStart.x] = sandStart.value;
    
    updateMinMaxPos(sandStart);

    return map;
}

function viz (original, maxY, zoom = 5, pad = 0) {
    if (maxY) maxY += zoom;
    const map = [];

    const diffX = maxPos.x - minPos.x + zoom + 1;
    const diffY = maxPos.y - minPos.y + zoom + 1;

    for (let y = 0; y < diffY + zoom; y++) {
        let yValue = original[y + minPos.y - zoom];

        if (maxY && y === maxY) {
            map[y] = '#'.repeat(diffX + zoom).split('');
            continue;
        }

        if (typeof yValue === 'undefined') {
            map[y] = '.'.repeat(diffX + zoom).split('');
            continue;
        }

        for (let x = 0; x < (diffX + zoom); x++) {
            if (!map[y]) {
                map[y] = [];
            }
            const xValue = yValue[x + minPos.x - zoom];

            if (typeof xValue === 'undefined') {
                map[y][x] = '.';

                continue;
            }

            map[y][x] = xValue;
        }
    }
    
    console.log(map.map(v => '  '.repeat(pad) + v.join('')).join('\n'))
}

function run(map, maxY) {
    let finished = false;
    
    let sandCount = 0;
    
    while (!finished) {    
        const currentSand = {
            x: sandStart.x,
            y: sandStart.y,
            value: 'o'
        };
    
        let isAtRest = false;
        
        while(isAtRest === false) {
    
            let below = map[currentSand.y + 1];
    
            if (!below) {
                currentSand.y = currentSand.y + 1;
            } else {
                if (!below[currentSand.x]) {
                    currentSand.y = currentSand.y + 1;
                }
        
                if(obstacles.indexOf(below[currentSand.x]) > -1) { //obstacle below
                    if (obstacles.indexOf(below[currentSand.x - 1]) > -1 && obstacles.indexOf(below[currentSand.x + 1]) > -1) { // obstacles diagonally too
                        isAtRest = true;
                        continue;
                    }
    
                    if (!below[currentSand.x - 1]) { //nothing to the bottom left diagonal
                        currentSand.x = currentSand.x - 1;
                        currentSand.y++;
                    } else if (!below[currentSand.x + 1]) { //nothing to the bottom right diagonal
                        currentSand.x = currentSand.x + 1;
                        currentSand.y++;
                    }
                }
            }
    
            if ((currentSand.y > maxPos.y && !maxY) || (currentSand.x === sandStart.x && currentSand.y === sandStart.y)) {
                finished = true;
                break;
            }

            if (maxY && currentSand.y + 1 > maxY) {
                isAtRest = true;
                break;
            }
        }

        updateMinMaxPos(currentSand);
    
        sandCount++;
    
        if (!map[currentSand.y]) {
            map[currentSand.y] = [];
        }
    
        map[currentSand.y][currentSand.x] = currentSand.value;
        
        if (maxY && currentSand.x === sandStart.x && currentSand.y === sandStart.y) {
            finished = true;
        }
    }

    return sandCount;
}

const positions1 = getPositions(cleanData);
const map1 = getMap(positions1);
const sandCount1 = run(map1);

viz(map1);

console.log('Part 1: ', sandCount1 - 1)

const positions2 = getPositions(cleanData);
const map2 = getMap(positions2);
const sandCount2 = run(map2, maxPos.y + 1);

viz(map2, maxPos.y + 1);

console.log('Part 2: ', sandCount2)