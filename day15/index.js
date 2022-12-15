const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const cleanData = data.split('\n').filter(v => v !== '');

const re = /Sensor at x=(\-?\d+), y=(\-?\d+): closest beacon is at x=(\-?\d+), y=(\-?\d+)/;

const sensors = [];
const map = {};

const minPos = {
    x: Infinity,
    y: Infinity,
};

const maxPos = {
    x: 0,
    y: 0,
};

const manhattanDistance = (pos1, pos2) => {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};

const updateMap = pos => {
    minPos.x = Math.min(minPos.x, pos.x);
    maxPos.x = Math.max(maxPos.x, pos.x);

    minPos.y = Math.min(minPos.y, pos.y);
    maxPos.y = Math.max(maxPos.y, pos.y);

    if (!map[pos.y]) {
        map[pos.y] = {};
    }

    map[pos.y][pos.x] = pos.char;
};

cleanData.map(v => {
    const points = v.match(re);
    const sensor = {
        x: Number.parseInt(points[1]),
        y: Number.parseInt(points[2]),
        char: 'S',
    };
    
    updateMap(sensor);

    const beacon = {
        x: Number.parseInt(points[3]),
        y: Number.parseInt(points[4]),
        char: 'B',
    };
    
    updateMap(beacon);

    sensor.distanceToBeacon = manhattanDistance(sensor, beacon);

    minPos.x = Math.min(minPos.x, sensor.x - sensor.distanceToBeacon, beacon.x - sensor.distanceToBeacon);
    maxPos.x = Math.max(maxPos.x, sensor.x + sensor.distanceToBeacon, beacon.x + sensor.distanceToBeacon);

    sensors.push(sensor);
});

const calculateSensorDistance = (sensor, position) => manhattanDistance(sensor, {...position}) <= sensor.distanceToBeacon;

let part1 = 0;

const y = 2000000;

if (!map[y]) {
    map[y] = {};
}

for (let x = minPos.x; x <= maxPos.x; x++) {
    if (!map[y][x] && sensors.some((sensor) => calculateSensorDistance(sensor, {x,y}))) {
        part1++;
    } 
}

console.log('Part 1:', part1);

let part2 = 0;

const maxY = 4000000;

loopX:
for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxY; x++) {
        let sensor = sensors.find((sensor) => calculateSensorDistance(sensor, {x,y}));

        if (sensor) {
            x = sensor.x + sensor.distanceToBeacon - Math.abs(sensor.y - y);
            continue;
        } 
        
        part2 = (x * maxY) + y;
        break loopX;
    }
}

console.log('Part 2:', part2);