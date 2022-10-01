#!./shebang.sh
"use strict";
exports.__esModule = true;
var commander_1 = require("commander");
var fs = require("fs");
var program = new commander_1.Command();
var config = JSON.parse(fs.readFileSync('../package.json', 'utf-8'));
// const parseTSVFile = (path: string) => {
//   const table = readFileSync(path).toString();
//   const result = [];
//   const lines = table.split('\n');
//   const headers = lines[0].split('\t');
//   for(let i=1;i<lines.length;i++){
//     const obj = {};
//     const currentLine = lines[i].split('\t');
//
//     for(let j=0;j<headers.length;j++){
//       obj[headers[j]] = currentLine[j];
//     }
//     result.push(obj);
//   }
//   const answer = [];
//   for (let i=0;i<result.length;i++){
//     const val = result[i];
//     const film = Film(val.name);
//     answer.push(film);
//   }
//   console.log(answer);
//   return JSON.stringify(result);
// };
program
    .name('cli')
    .description('Программа для подготовки данных для REST API сервера.')
    .version(config.version, '--version', 'выводит номер версии')
    .option('-h, --help', 'печатает этот текст', function () { return program.help(); });
program.parse(process.argv);
