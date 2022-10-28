import chalk from 'chalk';
import inquirer from 'inquirer';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { markdownTable } from 'markdown-table';
import { Directory } from './directory.js';
import Conf from 'conf';
const config = new Conf();
const pathBase = process.cwd();

export class Adr {
    private static pathAdr = config.get('adr-path');

    public static GetQuestionsToAdd(): any{
        return Add.QuestionsForAdd();
    }

    public static AddWithAnswers(answers:any){
        Add.createFile(answers);
    }

    public static AddWithoutAnswers(answers:any){
        Add.createFileImediatly(answers);
    }

    public static CreateIndex() {
        let basePath:string = `${this.pathAdr}`;
        let splitPath = basePath.split("\\");
        let fileArr = [['ADR', 'Name', 'Status']];
        let pathdir = `${pathBase}\\${splitPath[0]}`;
        let path = `${pathdir}\\${splitPath[1]}`;
        let table = "";
        readdirSync(path).forEach(file => {
          let seq = this.getSequences(file);
          let title = file.replace(/-/g, ' ').replace(/.md/g, '');
          title = title.substring(5, title.length)
          let row = [`[ADR-${seq}](adr/${file})`, title, '$\color{DodgerBlue}{proposed}$'];
          fileArr.push(row);
        });
        table = markdownTable(fileArr);
        this.validateOrCreateIndex(pathdir, table);
      }

      private static getSequences(str:string) {
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

      private static validateOrCreateIndex(path:string, table:any) {
        try {
          let templateIndedx = readFileSync('./templates/index.md', { encoding: 'utf8', flag: 'r' });    
          let result = templateIndedx.replace(/<!--MakrToAppendFiles>/g, table);
          writeFileSync(`${path}\\index.md`, result, { mode: 0o777 });
          console.log(chalk.green("Index file generated successfully."));
        } catch (err) {
          console.error(chalk.red.bold(err));
          process.exit();
        }
      }
}

export class Add {
    // Template que usaremos para la creación del contenido del fichero
    private static templateAdr = readFileSync('./templates/adr.md', { encoding: 'utf8', flag: 'r' });
    private static pathAdr = config.get('adr-path');

    public static QuestionsForAdd() {
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

    public static createFile(data: any) {
        let path = `${pathBase}\\${this.pathAdr}`;
        let lastAdrCreate = Directory.getMostRecentFile(path);
        let seq = "0000";
        if (lastAdrCreate === undefined) {
            console.log(chalk.yellow.bold("Get last file name to geneate sequences."));
            process.exit();
        } else {
            let nameLastAdr = lastAdrCreate[lastAdrCreate.length - 1];
            seq = this.getNextSequences(nameLastAdr);
        }

        let fileName = this.getNewName(data.shortTitle);
        const file = `${path}\\${seq}-${fileName}.md`;
        if (!existsSync(path)) {
            mkdirSync(path, 0o777);
        }
        try {
            this.templateAdr = this.templateAdr.replace('$shortTitle', data.shortTitle);
            this.templateAdr = this.templateAdr.replace('$contextDescription', this.checkContextValid(data.contextDescription));
            writeFileSync(file, this.templateAdr, { mode: 0o777 });
        } catch (err) {
            console.error(chalk.red.bold(err));
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

    public static createFileImediatly(data: any) {
        let path = `${pathBase}\\${this.pathAdr}`;
        let lastAdrCreate = Directory.getMostRecentFile(path);

        let seq = "0000";
        if (lastAdrCreate === undefined) {
            console.log(chalk.yellow.bold("Get last file name to geneate sequences."));
            process.exit();
        } else {
            let nameLastAdr = lastAdrCreate[lastAdrCreate.length - 1];
            //console.log(lastAdrCreate, nameLastAdr);
            seq = this.getNextSequences(nameLastAdr);
        }

        let fileName = this.getNewName(data.shortTitle);
        let file = `${path}\\${seq}-${fileName}.md`;
        if (!existsSync(path)) {
            mkdirSync(path, 0o777);
        }
        try {
            this.templateAdr = this.templateAdr.replace('$shortTitle', data.shortTitle);
            this.templateAdr = this.templateAdr.replace('$contextDescription', this.checkContextValid(""));
            writeFileSync(file, this.templateAdr, { mode: 0o777 });
        } catch (err) {
            console.error(chalk.red.bold(err));
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
    };

    //get next sequence in directopry to adr name`s
    private static getNextSequences(str: string): string {
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

    //Copnvert string to name of adr file
    private static getNewName(data: string): string {
        let str = data.replace(/\s+/g, '-').toLowerCase();
        return str;
    };

    private static checkContextValid(str:string) {
        if (this.isEmpty(str))
          return "{Describe the context and problem statement, e.g., in free form using two to three sentences or in the form of an illustrative story. You may want to articulate the problem in form of a question and add links to collaboration boards or issue management systems.}";
        else
          return str;
      };

      static isEmpty = (str: string) => (!str?.length);
}

export default Adr;