const fs = require('fs');
const https = require('https');

const args = process.argv.slice(2);

if (!args[0]) {
  throw new Error('Argument 0 is missing, add the day as the first arg.');
}

if (!args[0]) {
  throw new Error('Argument 1 is missing, add Session ID as the second arg.');
}

const directory = `./day${args[0]}`;

(async () => {

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    https.get(`https://adventofcode.com/2022/day/${args[0]}/input`, 
      {
         headers: {
          cookie: `cookie: ${args[1]}`,
         },
      }, 
      res => {

        res.setEncoding('utf8');
        let rawData = '';

        res.on('data', (chunk) => { rawData += chunk; });

        res.on('end', () => {
          try {
            fs.writeFileSync(`${directory}/data.txt`, rawData);
            if (!fs.existsSync(`${directory}/index.js`)) {
              fs.writeFileSync(`${directory}/index.js`, `const fs = require ('fs');

const data = Buffer.from(fs.readFileSync('./data.txt')).toString();
`);
            }
          } catch (e) {
            console.error(e.message);
          }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
})();