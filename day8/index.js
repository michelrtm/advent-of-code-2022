const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

let part1 = 0, part2 = 0;

const cleanData = data.split('\n').filter(v => v !== '');

cleanData.map((v, row) => {    
    const trees = v.split('');

    trees.map((tree, column) => {
        //edges
        if (row === 0 || column === 0 || row === cleanData.length - 1 || column === trees.length - 1) {
            part1++;
            return;
        }

        let visibleLeft = true, visibleRight = true, visibleTop = true, visibleBottom = true;

        // row
        for (let index = 0; index < trees.length; index++) {
            if (index === column) continue;

            if (index < column && Number.parseInt(trees[index]) >= Number.parseInt(tree)) {
                visibleLeft = false;
            }

            if (index > column && Number.parseInt(trees[index]) >= Number.parseInt(tree)) {
                visibleRight = false;
            }
        }

        //column
        for (let index = 0; index < cleanData.length; index++) {
            if (index === row) continue;

            if (index < row && Number.parseInt(cleanData[index][column]) >= Number.parseInt(tree)) {
                visibleTop = false;
            }

            if (index > row && Number.parseInt(cleanData[index][column]) >= Number.parseInt(tree)) {
                visibleBottom = false;
            }
        }

        if (visibleLeft || visibleRight || visibleTop || visibleBottom) {
            part1++;
        }
    });

    trees.map((tree, column) => {
        let scenicScore = 0;

        let vdLeft = 0, vdRight = 0, vdTop = 0, vdBot = 0;

        for (let i = column - 1; i > -1; i--) { //look left
            vdLeft++;

            if (Number.parseInt(trees[i]) >=  Number.parseInt(tree)) {
                break;
            }
        }

        for (let i = column + 1; i < trees.length; i++) { //look right
            vdRight++;

            if (Number.parseInt(trees[i]) >=  Number.parseInt(tree)) {
                break;
            }
        }

        //look up
        for (let i = row - 1; i > -1; i--) {
            vdTop++;

            if (Number.parseInt(cleanData[i][column]) >= Number.parseInt(tree)) {
                break;
            }
        }

        //look down
        for (let i =  row + 1; i < cleanData.length; i++) {
            vdBot++;

            if (Number.parseInt(cleanData[i][column]) >= Number.parseInt(tree)) {
                break;
            }
        }

        scenicScore = vdLeft * vdRight * vdTop * vdBot;

        if (scenicScore > part2) {
            part2 = scenicScore;
        }
    });
});

console.log('Part 1:', part1);
console.log('Part 2:', part2);
