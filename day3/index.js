const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

let fPart = 0;
let sPart = 0;

const groups = [];

let group = 0;

function anythingInCommon(a, b){
    if( b.length < a.length )
        return anythingInCommon(b, a)

    for( var i = 0, len = a.length; i < len; i++ ) 
        if(b.indexOf(a[i]) != -1)
            return true;
  
    return false
}

data.split('\n').map((v, i) => {
    if (!v) return;
    const first = v.substr(0, v.length/  2);
    const second = v.substr(v.length / 2, v.length + 1);

    const common = [];

    for (let char of first) {
        if (second.includes(char)) {
            common.push(char);
        }
    }

    const filtered = common.filter((v, i, s) => s.indexOf(v) === i);

    filtered.map(v => {
        let priority = v.charCodeAt(0) - 96;

        if (priority <= 0) {
            priority += 58;
        }

        fPart += priority;
    });

    if (i%3 === 0 && i > 0) {
        group++;
    }

    if (!groups[group]) groups[group] = [];

    groups[group].push(v);
})

groups.map(v => {
    const common = [];

    for (const char of v[0]) {
        if (v[1].includes(char) && v[2].includes(char)) {
            common.push(char)
        }
    }

    const filtered = common.filter((v, i, s) => s.indexOf(v) === i);

    filtered.map(v => {
        let priority = v.charCodeAt(0) - 96;

        if (priority <= 0) {
            priority += 58;
        }

        sPart += priority;
    });
});
console.log('Part 1:', fPart);

console.log('Part 2:', sPart);