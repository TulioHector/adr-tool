import { accessSync, constants, readFileSync, writeFileSync } from 'fs';
import { ModulesPath } from './managePath.js';
import Table from 'cli-table3';
import {Locale} from './locale.js';
import chalk from 'chalk';

export interface OptionsConfig extends Record<string,any>{
    "adrPath": string
}

export class Configuration {
    private jsonFile: Record<string, any> = {};
    private pathFile: string = `${ModulesPath.getInstalledPathSync('adr-cli')}\\dist\\config\\default.json`;
    public readonly path: string = `${ModulesPath.getInstalledPathSync('adr-cli')}\\dist\\config`;
    private readonly _locale:any;

    constructor() {
        this._locale = Locale.getInstance().getLocale();
    }

    public setDefaultValues(object: any) {
        for (let key in object) {
            let value: any = object[key];
            this.jsonFile[key] = value;
        }
        let newData = JSON.stringify(this.jsonFile);
        writeFileSync(this.pathFile, newData);
    }

    public checkConfigFileExistsSync() {
        let flag = true;
        try {
            accessSync(this.pathFile, constants.F_OK);
        } catch (e) {
            flag = false;
        }
        return flag;
    }

    public file(path?: string): void {
        if(path !== undefined){
            this.pathFile = path;
        }
        
        const data = readFileSync(this.pathFile, { encoding: 'utf8', flag: 'r' });
        this.jsonFile = JSON.parse(data);
    }

    public set(key: string, value: any) {
        this.file();
        this.jsonFile[key] = value;
        this.saveFile();
    }

    public get(key: string): string {
        const file = readFileSync(this.pathFile, { encoding: 'utf8', flag: 'r' });
        const data = JSON.parse(file);
        return data[key];
    }

    public getShow(): any {
        const file = readFileSync(this.pathFile, { encoding: 'utf8', flag: 'r' });
        const data = JSON.parse(file);
        return data;
    }

    public displayPropertiesValues() {
        const tableFiles = new Table({
            head: this._locale.command.config.show.table.columnName,
        });
        const config: any = this.getShow();
        const keys = Object.keys(config);
        
        for (const key of keys) {
            const localeKey = this._locale.command.config.show.table.rows[key];
            tableFiles.push([
                key,
                config[key],
                localeKey
            ]);
        }

        console.log(tableFiles.toString());
    }

    private saveFile() {
        const newData = JSON.stringify(this.jsonFile);
        writeFileSync(this.pathFile, newData, { mode: 0o777 });
    }

    public resetConfig() {
        console.log(`Configurations file reset successfully in this folder: ${chalk.cyan.bold(this.path)}`);
    }

    public getCurrentPath() {
        console.log(`Configuration file create in this folder: ${chalk.cyan.bold(this.path)}`);
    }
}

export default Configuration;