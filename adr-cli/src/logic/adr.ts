import {readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rename} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {markdownTable} from 'markdown-table';
import moment from 'moment';
import {Configuration} from '../utils/configurations.js';
import {Locale} from '../utils/locale.js';
import type {ILocale} from '../utils/ilocale.js';
import Utils from '../utils/utils.js';
import {Directory} from './directory.js';
import {Enums} from './enums.js';

const config = new Configuration();
const enums = new Enums();
const pathBase = process.cwd();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export class Adr {
    private readonly _add = new Add();
    private readonly pathAdr = config.get('adrPath');
    private readonly _locale: ILocale;

    constructor() {
        this._locale = Locale.getInstance().getLocale();
    }

    public async getQuestionsToAdd(): Promise<Record<string, string>> {
        const result = this._add.questionsForAdd();
        return result;
    }

    public addWithAnswers(answers: Record<string, string>): void {
        this._add.createFile(answers);
    }

    public addWithoutAnswers(answers: Record<string, string>) {
        this._add.createFileImediatly(answers);
    }

    public createIndex() {
        const basePath = `${this.pathAdr}`;
        const splitPath = basePath.split('\\');
        const fileArray = [['ADR', 'Name', 'Status']];
        const pathdir = `${pathBase}\\${splitPath[0]}`;
        const path = `${pathdir}\\${splitPath[1]}`;
        let table = '';
        const files = readdirSync(path);
        for (const file of files) {
            const seq = this.getSequences(file);
            const statusAdr = Directory.getStatusForAdr(file, path);
            const matches = statusAdr.matchAll(/{([^}]*)}/g);
            const matches2 = Array.from(matches);
            const textColor = matches2[0][1];
            const textStatus = matches2[1][1];
            let title = file.replace(/-/g, ' ').replace(/.md/g, '');
            title = title.slice(5, title.length);
            const row = [`[ADR-${seq}](adr/${file})`, title, `$\\color{${textColor}}{${textStatus}}$`];
            fileArray.push(row);
        }

        table = markdownTable(fileArray);
        this.validateOrCreateIndex(pathdir, table);
    }

    public getSequences(string_: string): string {
        try {
            if (string_ === undefined) {
                string_ = '0000';
            }

            const seq = Number(string_.slice(0, 4));

            return seq.toString().padStart(4, '0');
        } catch (error: unknown) {
            let message = 'Unknown Error';
            if (error instanceof Error) {
                message = error.message;
                console.error(chalk.red.bold(`Error in parse next sequence to adr file:${message}`));
            }
            process.exit();
        }
    }

    public suppressedAdr(idToSupress: number, id: string[]): void {
        const pathdir = `${pathBase}\\${this.pathAdr}`;
        let nameFile: string = Utils.getFileNameById(idToSupress);
        nameFile = `${pathdir}\\${nameFile}`;
        console.log(nameFile);
        const newNameFile = nameFile.replace('.md', '-suppressed.md');
        console.log(newNameFile);
        rename(nameFile, newNameFile, error => {
            if (error) {
                throw error;
            }
            console.log(chalk.greenBright.bold(this._locale.class.adr.Adr.suppressedAdr.okRanameAdrFile));
          });
        const status = new Status();
        status.setStatusToAdr(idToSupress, 'superseding');
        this.addRelationToAdr(idToSupress, id);
    }

    public addRelationToAdr(ids: number, idTo: string[]): void {
        const pathdir = `${pathBase}\\${this.pathAdr}`;
        let nameFile = Utils.getFileNameById(ids);
        nameFile = `${pathdir}\\${nameFile}`;
        this.addRelationsToAdr(nameFile, idTo);
    }

    public setDefaultRel(value: string, defaultValue: string) {
        return value;
    }

    private addRelationsToAdr(nameFile: string, idTo: string[]): void {
        const file = readFileSync(nameFile, {encoding: 'utf8', flag: 'r'});
        const searchString = '* Rel:';
        const re = new RegExp(`^.*\\${searchString}.*$`, 'gm');
        const adrsIds = Array.from(idTo, x => x.padStart(4, '0'));
        const text = `${searchString} ${adrsIds.toString()}`;
        const formatted = file.replace(re, text);
        writeFileSync(nameFile, formatted, {mode: 0o777});
    }

    private validateOrCreateIndex(path: string, table: string): void {
        try {
            console.log(chalk.green(this._locale.class.adr.Adr.validateOrCreateIndex.reading));
            const locale = config.get('locale');
            const templateIndedx: string = readFileSync(`${__dirname}\\..\\templates\\index-${locale}.md`, {encoding: 'utf8', flag: 'r'});
            const search = /<!--MakrToAppendFiles>/g;
            const result = templateIndedx.replace(search, table);
            writeFileSync(`${path}\\index.md`, result, {mode: 0o777});
            console.log(chalk.green(this._locale.class.adr.Adr.validateOrCreateIndex.generated));
        } catch (error: unknown) {
            console.error(chalk.red.bold(error));
            process.exit();
        }
    }
}

export class Status {
    private readonly pathAdr = config.get('adrPath');
    private readonly _adr = new Adr();

    public async getStatus(): Promise<Record<string, string>> {
        return this.choiceStatus();
    }

    public setStatusToAdr(id: number, status: string) {
        const pathdir = `${pathBase}\\${this.pathAdr}`;
        let nameFile = this.getFileNameById(id);
        nameFile = `${pathdir}\\${nameFile}`;
        const validateStatus = this.validateStatusType(status);
        if (!validateStatus) {
            throw new Error('Error in validate status selected, Please review status selected.');
        }

        this.setStatusToFileAdr(nameFile, status);
    }

    public setDefaultStatus(value: string, defaultValue: string) {
        return value;
    }

    private async choiceStatus(): Promise<Record<string, string>> {
        const choice = [
            {
                type: 'list',
                name: 'status',
                message: 'Choice one status',
                choices: [
                    'proposed',
                    'acceptance',
                    'rejection',
                    'deprecation',
                    'superseding',
                ],
            },
        ];
        return await inquirer.prompt(choice) as Record<string, string>;
    }

    private setStatusToFileAdr(fileName: string, status: string) {
        const file = readFileSync(fileName, {encoding: 'utf8', flag: 'r'});
        const searchString = '* Status:';
        const re = new RegExp(`^.*\\${searchString}.*$`, 'gm');
        const colorStatus = this.setStatusColor(status);
        const formatted = file.replace(re, colorStatus);
        writeFileSync(fileName, formatted, {mode: 0o777});
    }

    private validateStatusType(status: string) {
        switch (status) {
            case 'proposed':
            case 'acceptance':
            case 'rejection':
            case 'deprecation':
            case 'superseding': {
                return true;
            }
            default: {
                console.error(chalk.red('Error in status definitions.'));
                return false;
            }
        }
    }

    private getFileNameById(id: number): string {
        let matchedFiles = '';
        const pathdir = `${pathBase}\\${this.pathAdr}`;
        const files = readdirSync(pathdir);
        for (const file of files) {
            const seq = Number.parseInt(this._adr.getSequences(file), 10);
            if (seq === id) {
                matchedFiles = file;
                return matchedFiles;
            }
        }

        return matchedFiles;
    }

    private setStatusColor(status: string): string {
        switch (status) {
            case 'proposed': {
                return `* Status: ${enums.statusColor.proposed}`;
            }
            case 'acceptance': {
                return `* Status: ${enums.statusColor.acceptance}`;
            }
            case 'rejection': {
                return `* Status: ${enums.statusColor.rejection}`;
            }
            case 'deprecation': {
                return `* Status: ${enums.statusColor.deprecation}`;
            }
            case 'superseding': {
                return `* Status: ${enums.statusColor.superseding}`;
            }
            default: {
                console.error(chalk.red('Error in status definitions.'));
                return 'false';
            }
        }
    }
}

export class Add {
    // Template que usaremos para la creación del contenido del fichero
    private templateAdr: string;
    private readonly pathAdr = config.get('adrPath');
    private readonly _directory = new Directory();
    private readonly _locale: ILocale;

    constructor() {
        this._locale = Locale.getInstance().getLocale();
        const locale = config.get('locale');
        this.templateAdr = readFileSync(`${__dirname}\\..\\templates\\adr-${locale}.md`, {encoding: 'utf8', flag: 'r'});
    }

    public async questionsForAdd(): Promise<Record<string, string>> {
        const qs = [{
            name: 'shortTitle',
            type: 'input',
            message: this._locale.command.new.withAnswers.shortTitle,
        }, {
            name: 'contextDescription',
            type: 'input',
            message: this._locale.command.new.withAnswers.contextDescription,
        }];
        return await inquirer.prompt(qs) as Record<string, string>;
    }

    public createFile(data: Record<string, string>): void {
        const path = `${pathBase}\\${this.pathAdr}`;
        this.createDirectory(path);
        const lastAdrCreate = this._directory.getMostRecentFile(path);
        let seq = '0000';
        if (lastAdrCreate === undefined) {
            console.log(chalk.yellow.bold('Get last file name to geneate sequences.'));
            process.exit();
        } else {
            const nameLastAdr = lastAdrCreate[lastAdrCreate.length - 1];
            seq = this.getNextSequences(nameLastAdr);
        }

        const fileName = this.getNewName(data.shortTitle);
        const file = `${path}\\${seq}-${fileName}.md`;
        if (!existsSync(path)) {
            mkdirSync(path, 0o777);
        }

        try {
            this.templateAdr = this.templateAdr.replace('$shortTitle', data.shortTitle);
            const date = moment().format('YYYY-MM-DD hh:mm:ss');
            this.templateAdr = this.templateAdr.replace('$dateAdr', date);
            this.templateAdr = this.templateAdr.replace('$contextDescription', this.checkContextValid(data.contextDescription));
            writeFileSync(file, this.templateAdr, {mode: 0o777});
        } catch (error: unknown) {
            console.error(chalk.red.bold(error));
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

    public createFileImediatly(data: Record<string, string>): void {
        const path = `${pathBase}\\${this.pathAdr}`;
        this.createDirectory(path);
        const lastAdrCreate = this._directory.getMostRecentFile(path);

        let seq = '0000';
        if (lastAdrCreate === undefined) {
            console.log(chalk.yellow.bold('Get last file name to geneate sequences.'));
            process.exit();
        } else {
            const nameLastAdr = lastAdrCreate[lastAdrCreate.length - 1];
            seq = this.getNextSequences(nameLastAdr);
        }

        const fileName = this.getNewName(data.shortTitle);
        const file = `${path}\\${seq}-${fileName}.md`;
        if (!existsSync(path)) {
            mkdirSync(path, 0o777);
        }

        try {
            this.templateAdr = this.templateAdr.replace('$shortTitle', data.shortTitle);
            const date = moment().format('YYYY-MM-DD hh:mm:ss');
            this.templateAdr = this.templateAdr.replace('$dateAdr', date);
            this.templateAdr = this.templateAdr.replace('$contextDescription', this.checkContextValid(''));
            writeFileSync(file, this.templateAdr, {mode: 0o777});
        } catch (error: unknown) {
            console.error(chalk.red.bold(error));
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

    private createDirectory(dirname: string): void {
        if (!existsSync(dirname)) {
            mkdirSync(dirname, {recursive: true});
        }
    }

    private getNextSequences(string_: string): string {
        try {
            if (string_ === undefined) {
                string_ = '0000';
            }

            const seq = Number(string_.slice(0, 4));
            const newSeq = seq + 1;

            if (newSeq > 9999) {
                throw new Error('Max ADR sequences reached');
            }

            return newSeq.toString().padStart(4, '0');
        } catch (error: unknown) {
            let message = 'Unknown Error';
            if (error instanceof Error) {
                message = error.message;
                console.error(chalk.red.bold(`Error in parse next sequence to adr file:${message}`));
            }

            process.exit();
        }
    }

    private getNewName(data: string): string {
        const string_ = data.replace(/\s+/g, '-').toLowerCase();
        return string_;
    }

    private checkContextValid(string_: string) {
        if (this.isEmpty(string_)) {
            return this._locale.class.adr.Add.checkContextValid;
        }

        return string_;
    }

    private readonly isEmpty = (string_: string) => (!string_?.length);
}

export default Adr;
