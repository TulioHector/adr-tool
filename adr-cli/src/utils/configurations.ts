import { accessSync, constants, readFileSync, writeFileSync } from 'fs';
import { ModulesPath } from './managePath.js';

export interface OptionsConfig extends Record<string,any>{
    "adr-path": string
}

export class Configuration {
    private jsonFile: Record<string, any> = {};
    private pathFile: string = `${ModulesPath.getInstalledPathSync('adr-cli')}\\dist\\config\\default.json`;
    public path: string = `${ModulesPath.getInstalledPathSync('adr-cli')}\\config`;

    constructor(object?: any) {
        let cualca = ModulesPath.getInstalledPathSync('adr-cli');
        
        console.log("termino", cualca);
        //create file if is not exist and set adr path
        let isExistConfig = this.CheckConfigFileExistsSync();
        if (!isExistConfig) {
            writeFileSync(this.pathFile, "", { flag: "wx" });
        }
        
        if(object === undefined)
            return;
        
        let objLength = Object.keys(object).length;
        console.log(objLength);
        if (objLength > 0) {
            this.SetDefaultValues(object);
        }
    }

    private SetDefaultValues(object: any) {
        console.log("estoy en el set defdault");
        
        for (let key in object) {
            let value: any = object[key];
            this.jsonFile[key] = value;
        }
        let newData = JSON.stringify(this.jsonFile);
        writeFileSync(this.pathFile, newData);
    }

    public CheckConfigFileExistsSync() {
        let flag = true;
        try {
            accessSync(this.pathFile, constants.F_OK);
        } catch (e) {
            flag = false;
        }
        return flag;
    }

    public File(path?: string): void {
        if(path !== undefined){
            this.pathFile = path;
        }
        
        let data = readFileSync(this.pathFile, { encoding: 'utf8', flag: 'r' });
        this.jsonFile = JSON.parse(data);
    }

    public Set(key: string, value: any) {
        let newData: Record<string, any> = {};
        newData[key] = value;
        this.jsonFile[key] = newData;
        this.saveFile();
    }

    public Get(key: string): string {
        //console.log(this.path);
        let file = readFileSync(this.pathFile, { encoding: 'utf8', flag: 'r' });
        let data = JSON.parse(file);
        return data[key];
    }

    private saveFile() {
        let newData = JSON.stringify(this.jsonFile);
        writeFileSync(this.pathFile, newData, { flag: "wx" });
    }
}

export default Configuration;