import chalk from 'chalk';
import figlet from 'figlet';
import inquirer from 'inquirer';
const pathBase = process.cwd();
import fs from 'fs';
import { getMostRecentFile } from './directory.js'

// Template que usaremos para la creación del contenido del fichero
let templateAdr = fs.readFileSync('./templates/adr.md', { encoding: 'utf8', flag: 'r' });



export default function setStatusToAdr(id){
    let pathdir = `${pathBase}\\doc\\adr`;
    let nameFile = getById(id);
    nameFile = pathdir+nameFile;

}

const getById = (id) => {
    let matchedFiles = "";
    let pathdir = `${pathBase}\\doc\\adr`;
    let files =  fs.readdirSync(pathdir);
    files.forEach(file => {
        if (file.startsWith(id)) {
            matchedFiles =file;
            return;
        }
    });

    return matchedFiles;
}

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
  console.log("estoy aca ahora createFile",data);
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