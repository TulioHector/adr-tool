const pathBase = process.cwd();
import fs from 'fs';
import chalk from 'chalk';
import { markdownTable } from 'markdown-table';
import Conf from 'conf';
const config = new Conf();

let basePath = config.get('adr-path');

export default function createAdrIndex() {
  let splitPath = basePath.split("\\");
  let fileArr = [['ADR', 'Name', 'Status']];
  let pathdir = `${pathBase}\\${splitPath[0]}`;
  let path = `${pathdir}\\${splitPath[1]}`;
  let table = "";
  fs.readdirSync(path).forEach(file => {
    let seq = getSequences(file);
    let title = file.replace(/-/g, ' ').replace(/.md/g, '');
    title = title.substring(5, title.length)
    let row = [`[ADR-${seq}](adr/${file})`, title, '$\color{DodgerBlue}{proposed}$'];
    fileArr.push(row);
  });
  table = markdownTable(fileArr);
  validateOrCreateIndex(pathdir, table);
}

function validateOrCreateIndex(path, table) {
  try {
    let templateIndedx = fs.readFileSync('./templates/index.md', { encoding: 'utf8', flag: 'r' });    
    let result = templateIndedx.replace(/<!--MakrToAppendFiles>/g, table);
    fs.writeFileSync(`${path}\\index.md`, result, { mode: 0o777 });
    console.log(chalk.green("Index file generated successfully."));
  } catch (err) {
    console.error(chalk.red.bold(err));
    process.exit();
  }
}

//get next sequence in directopry to adr name`s
const getSequences = (str) => {
  try {
    if (str === undefined)
      str = "0000";
    let seq = Number(str.substring(0, 4));// get 4 first char`s and convert to number; je: 9999

    return seq.toString().padStart(4, '0');
  } catch (error) {
    console.error(chalk.red.bold("Error in parse next sequence to adr file:" + error));
    process.exit();
  }
};