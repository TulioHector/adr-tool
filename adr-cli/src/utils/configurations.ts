import { accessSync, constants, readFileSync, writeFileSync } from 'fs';
import { ModulesPath } from './managePath.js';

export interface OptionsConfig extends Record<string,any>{
    "adr-path": string
}

export class Configuration {
    private jsonFile: Record<string, any> = {};
    private pathFile: string = `${ModulesPath.getInstalledPathSync('adr-cli')}\\dist\\config\\default.json`;
    public readonly path: string = `${ModulesPath.getInstalledPathSync('adr-cli')}\\dist\\config`;

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
        
        let data = readFileSync(this.pathFile, { encoding: 'utf8', flag: 'r' });
        this.jsonFile = JSON.parse(data);
    }

    public set(key: string, value: any) {
        this.jsonFile[key] = value;
        this.saveFile();
    }

    public get(key: string): string {
        let file = readFileSync(this.pathFile, { encoding: 'utf8', flag: 'r' });
        let data = JSON.parse(file);
        return data[key];
    }

    private saveFile() {
        let newData = JSON.stringify(this.jsonFile);
        writeFileSync(this.pathFile, newData, { mode: 0o777 });
    }
}

export default Configuration;