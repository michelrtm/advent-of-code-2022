const fs = require ('fs');
const util = require('util');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

// const data = `$ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k`;

const structure = {};

const paths = [];

let currentPath = '';

data.split('\n').map((v, i) => {
    if (v === '') return;

    if (/^\$ cd/.test(v)) {
        const [,, folder] = v.split(' ');

        if (folder === '..') {
            paths.pop();
        } else {
            paths.push(folder);
        }

        currentPath = String(paths[0]) + paths.slice(1, paths.length).join('/');

        if (!structure[currentPath]) {
            structure[currentPath] = {
                directFileSize: 0,
                totalFileSize: 0,         
            };
        }
    }

    if (/^\d+\s/.test(v)) {
        structure[currentPath].directFileSize += Number(v.split(' ')[0]);
    }
});

const folders = Object.keys(structure).sort((a, b) => b.length - a.length);

folders.forEach(v => {
    folders.forEach(vv => {
        if ((new RegExp(`^${v.replace('/', '\\/')}`)).test(vv)) {
            structure[v].totalFileSize += structure[vv].directFileSize;
        }
    });
});

let part1 = 0;

const freeSpace = 70000000 - structure['/'].totalFileSize;

let part2 = 30000000;

Object.keys(structure).forEach(v => {
    if (structure[v].totalFileSize < 100000) {
        part1 += structure[v].totalFileSize;
    }

    if (freeSpace + structure[v].totalFileSize >= 30000000) {
        if (structure[v].totalFileSize < part2) {
            part2 = structure[v].totalFileSize;
        }
    }
});

console.log('Part 1: ', part1);
console.log('Part 2: ', part2);