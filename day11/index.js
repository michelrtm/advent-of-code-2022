const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();

const cleanData = data.split(/Monkey \d\:/g).filter(v => v !== '');

function getMonkeys() {
    const monkeys = [];

    cleanData.map(v => {
        const monkey = {
            items: [],
            inspected: 0,
        };

        const startingString = v.split('\n')[1].match(/Starting\sitems:\s([\,?\s?\d]+)/)[1];

        startingString
            .replace(' ', '')
            .split(',')
            .map(v => {
                monkey.items.push(Number.parseInt(v));
            });

        
        const operationString = v.split('\n')[2].match(/Operation:\snew\s\=\sold\s([\w\W]+)/)[1];

        const [operation, value] = operationString.split(' ');

        monkey.operate = getOperation(operation, value);
        
        const divisibleBy = v.split('\n')[3].match(/Test:\sdivisible\sby\s([\d]+)/)[1];
        const successString = v.split('\n')[4].match(/If\strue:\sthrow\sto\smonkey\s([\d]+)/)[1];
        const failureString = v.split('\n')[5].match(/If\sfalse:\sthrow\sto\smonkey\s([\d]+)/)[1];

        monkey.test = function (item) {
            item % divisibleBy === 0
            ? monkeys[Number.parseInt(successString)].items.push(item)
            : monkeys[Number.parseInt(failureString)].items.push(item);
        };

        monkey.divisibleBy = Number.parseInt(divisibleBy);
        
        monkeys.push(monkey);
    });

    return monkeys;
};

function getOperation(operation, value) {
    switch(operation) {
        case '*':
            if (Number.parseInt(value)) {
                return old => {
                    return old * Number.parseInt(value);
                }
            } else {
                return old => {
                    return old * old;
                }
            }
            break;
        case '+':
            if (Number.parseInt(value)) {
                return old => {
                    return old + Number.parseInt(value);
                }
            } else {
                return old => {
                    return old + old;
                }
            }
            break;
        case '-':
            if (Number.parseInt(value)) {
                return old => {
                    return old - Number.parseInt(value);
                }
            } else {
                return old => {
                    return old - old;
                }
            }
            break;
        case '/':
            if (Number.parseInt(value)) {
                return old => {
                    return old / Number.parseInt(value);
                }
            } else {
                return old => {
                    return old / old;
                }
            }
            break;
        default:
            throw new Error(`Operation ${operation} not supported.`)
            break;
    }
}

function letMonkeysLoose (monkeys, rounds, divider) {
    for (let round = 0; round < rounds; round++) {
        for (let monkey = 0; monkey < monkeys.length; monkey++) {
            while (monkeys[monkey].items.length > 0) {
                monkeys[monkey].inspected++;
                
                const item = monkeys[monkey].operate(monkeys[monkey].items.shift());
                
                const newItem = divider ? item % divider : Math.floor(item / 3);
        
                monkeys[monkey].test(newItem);
            }
        }
    }
}

const p1Monkeys = getMonkeys();
const p2Monkeys = getMonkeys();

letMonkeysLoose(p1Monkeys, 20);

p1Monkeys.sort((a,b) => b.inspected - a.inspected);

console.log('Part 1:', p1Monkeys[0].inspected * p1Monkeys[1].inspected);

const divider = p2Monkeys.map((monkey) => monkey.divisibleBy).reduce((a, b) => a * b, 1);

letMonkeysLoose(p2Monkeys, 10000, divider);

p2Monkeys.sort((a,b) => b.inspected - a.inspected);

console.log('Part 2:', p2Monkeys[0].inspected * p2Monkeys[1].inspected);