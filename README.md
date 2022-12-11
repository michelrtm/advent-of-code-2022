# Advent of Code 2022
> **_NOTE:_** Code is left as is once I submit the solution and get the second star.

## Usage
You will need to first log into the AOC 2022 website and then inspect an HTTP request using the developer tool, then grab the `cookie` value in the request. Once this is done, run the following command:
`node get-data.js {dayNumber} {cookies}`

This will create:
- `day{dayNumber}` folder;
- `day{dayNumber}/data.txt` file with the input data;
- `day{dayNumber}/index.js` with the following code:
  ```javascript
  const fs = require ('fs');

  const data = Buffer.from(fs.readFileSync('./data.txt')).toString();
  ```