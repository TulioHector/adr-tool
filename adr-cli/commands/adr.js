import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
import enums from '../utils/enums.js';
const pathBase = process.cwd();
import fs from 'fs';
import { getMostRecentFile } from './directory.js';
import Conf from 'conf';
const config = new Conf();

// Template que usaremos para la creación del contenido del fichero
let templateAdr = fs.readFileSync('./templates/adr.md', { encoding: 'utf8', flag: 'r' });
let pathAdr = config.get('adr-path');

export function setStatusToAdr(id, status) {
  let pathdir = `${pathBase}\\${pathAdr}`;
  let nameFile = getFileNameById(id);
  nameFile = pathdir + nameFile;
  let validateStatus = validateStatusType(status);
  if (!validateStatus)
    throw ('Error in validate status selected, Please review status selected.');

    setStatusToFileAdr(nameFile, status);
};

const validateStatusType = (status) => {
  switch (status) {
    case 'proposed':
    case 'acceptance':
    case 'rejection':
    case 'deprecation':
    case 'superseding':
      return true;
    default:
      console.error(chalk.red('Error in status definitions.'));
      return false;
  }
};

const getFileNameById = (id) => {
  let matchedFiles = "";
  let pathdir = `${pathBase}\\${pathAdr}`;
  let files = fs.readdirSync(pathdir);
  files.forEach(file => {
    if (file.startsWith(id)) {
      matchedFiles = file;
      return;
    }
  });

  return matchedFiles;
};

const setStatusToFileAdr = (fileName, status) => {
  //let adr = fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' });
  //adr = adr.replace('$shortTitle', status);

  fs.readFile(fileName, 'utf8', function (err, data) {
    let searchString = '* Status:';
    let re = new RegExp('^.*' + searchString + '.*$', 'gm');
    let formatted = data.replace(re, status);

    fs.writeFile(fileName, formatted, 'utf8', function (err) {
      if (err) return console.error(chalk.red(err));
    });
  });
};

const setStatusColor = (status) => {
  switch (status) {
    case 'proposed':
      return `* Status: ${enums.proposed}`;
    case 'acceptance':
      return `* Status: ${enums.acceptance}`;
    case 'rejection':
      return `* Status: ${enums.rejection}`;
    case 'deprecation':
      return `* Status: ${enums.deprecation}`;
    case 'superseding':
      return `* Status: ${enums.superseding}`;
    default:
      console.error(chalk.red('Error in status definitions.'));
      return false;
  }
};

// Preguntas que se van a realizar y que más tarde usaremos
export const queryParams = async () => {
  let qs = [{
    name: 'shortTitle',
    type: 'input',
    message: 'short title of solved problem and solution'
  }, {
    name: 'contextDescription',
    type: 'input',
    message: 'Context and Problem Statement: '
  }];

  return inquirer.prompt(qs);
};

//Copnvert string to name of adr file
const getNewName = (data) => {
  let str = data.replace(/\s+/g, '-').toLowerCase();
  return str;
};

const isEmpty = (str) => (!str?.length);

const checkContextValid = (str) => {
  if (isEmpty(str))
    return "{Describe the context and problem statement, e.g., in free form using two to three sentences or in the form of an illustrative story. You may want to articulate the problem in form of a question and add links to collaboration boards or issue management systems.}";
  else
    return str;
};

//get next sequence in directopry to adr name`s
const getNextSequences = (str) => {
  try {
    if (str === undefined)
      str = "0000";
    let seq = Number(str.substring(0, 4));// get 4 first char`s and convert to number; je: 9999
    let newSeq = seq + 1;

    if (newSeq > 9999)
      throw 'Max ADR sequences reached';

    return newSeq.toString().padStart(4, '0');
  } catch (error) {
    console.error(chalk.red.bold("Error in parse next sequence to adr file:" + error));
    process.exit();
  }
};

// Método que se encarga de crear el fichero en base a las preguntas realizadas
export const createFile = (data) => {
  const path = `${pathBase}\\doc\\adr`;
  let lastAdrCreate = getMostRecentFile(path);
  console.log("estoy aca ahora createFile", data);
  let seq = "0000";
  if (lastAdrCreate === undefined) {
    console.log(chalk.yellow.bold("Get last file name to geneate sequences."));
    process.exit();
  } else {
    let nameLastAdr = lastAdrCreate[lastAdrCreate.length - 1];
    console.log(lastAdrCreate, nameLastAdr);
    seq = getNextSequences(nameLastAdr);
  }

  let fileName = getNewName(data.shortTitle);
  const file = `${path}\\${seq}-${fileName}.md`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, 0o777);
  }
  try {
    templateAdr = templateAdr.replace('$shortTitle', data.shortTitle);
    templateAdr = templateAdr.replace('$contextDescription', checkContextValid(data.contextDescription));
    fs.writeFileSync(file, templateAdr, { mode: 0o777 });
  } catch (err) {
    console.error(err);
    process.exit();
  } finally {
    console.log(`
        ------ CREADO CORRECTAMENTE ------\n
        Se ha creado el siguiente elemento\n
        - Tipo: ${chalk.blue.bold(data.type)}\n
        - Ruta: ${chalk.blue.bold(file)}\n
        ----------------------------------\n
      `);
    process.exit();
  }
}

export const createFileImediatly = (data) => {
  let path = `${pathBase}\\doc\\adr`;
  let lastAdrCreate = getMostRecentFile(path);

  let seq = "0000";
  if (lastAdrCreate === undefined) {
    console.log(chalk.yellow.bold("Get last file name to geneate sequences."));
    process.exit();
  } else {
    let nameLastAdr = lastAdrCreate[lastAdrCreate.length - 1];
    //console.log(lastAdrCreate, nameLastAdr);
    seq = getNextSequences(nameLastAdr);
  }

  let fileName = getNewName(data.shortTitle);
  let file = `${path}\\${seq}-${fileName}.md`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, 0o777);
  }
  try {
    templateAdr = templateAdr.replace('$shortTitle', data.shortTitle);
    templateAdr = templateAdr.replace('$contextDescription', checkContextValid());
    fs.writeFileSync(file, templateAdr, { mode: 0o777 });
  } catch (err) {
    console.error(err);
    process.exit();
  } finally {
    console.log(`
        ------ CREADO CORRECTAMENTE ------\n
        Se ha creado el siguiente elemento\n
        - Tipo: ${chalk.blue.bold(data.shortTitle)}\n
        - Ruta: ${chalk.blue.bold(file)}\n
        ----------------------------------\n
      `);
    process.exit();
  }
}