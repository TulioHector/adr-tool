import table from 'cli-table3';
const pathBase = process.cwd();
import * as fs from 'fs';

export class Directory {
    //{ file: 'db-2020-08-03-12:13.sql', mtime: 2020-08-03T16:13:46.000Z }
    public static getMostRecentFile(dir: string) {
        let files = this.orderReccentFiles(dir);
        return files.length ? files : [];
    };

    public static orderReccentFiles(dir: string) : string[]{
        let arrFiles: string[] = [];
        fs.readdirSync(dir).forEach(file => {
            arrFiles.push(file);
        });
        return arrFiles;
    };

    public static displayDirectory(dir:string) {
        let tableFiles = new table({
            head: ['Id', 'File Name', 'Status']
        });
        let path = `${pathBase}\\${dir}`;
        let lastAdrCreate: string[] = this.getMostRecentFile(path);
        lastAdrCreate.forEach(file => {
            let seq = Number(file.substring(0, 4));
            let seqPadding = seq.toString().padStart(4, '0');
            tableFiles.push([
                seqPadding,
                file,
                'status'
            ]);
            
        });
        console.log(tableFiles.toString());
    }
}

export default Directory;