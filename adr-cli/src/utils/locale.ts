import { readFileSync} from 'fs';
import { ModulesPath } from './managePath.js';

export class Locale {
    private static currentLocale:Locale = new Locale();
    private _locale:any = {};

    constructor() {
        if(Locale.currentLocale){
            throw new Error("Error: Instantiation failed: Use Locale.getInstance() instead of new.");
        }
        Locale.currentLocale = this;
    }

    public static getInstance():Locale
    {
        return Locale.currentLocale;
    }

    public getLocale():any
    {
        const pathApp = ModulesPath.getInstalledPathSync('adr-cli');
        const pathConfigFile: string = `${ModulesPath.getInstalledPathSync('adr-cli')}\\dist\\config\\default.json`;
        const fileConfig = readFileSync(pathConfigFile, { encoding: 'utf8', flag: 'r' });
        const dataConfig = JSON.parse(fileConfig);

        this._locale = readFileSync(`${pathApp}\\dist\\locale\\${dataConfig['locale']}.json`, { encoding: 'utf8', flag: 'r' });
        const dataLocale = JSON.parse(this._locale);
        return dataLocale;
    }
}

export default Locale;