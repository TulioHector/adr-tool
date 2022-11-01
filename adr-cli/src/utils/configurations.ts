import { accessSync, constants } from 'fs';

export class Configuration {
    public static CheckConfigFileExistsSync(filepath:string){
        let flag = true;
        try {
            accessSync(filepath, constants.F_OK);
        } catch (e) {
            flag = false;
        }
        return flag;
    }
}

export default Configuration;