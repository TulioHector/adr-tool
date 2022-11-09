import * as fs from 'node:fs';
import Table from 'cli-table3';

const pathBase = process.cwd();
export class Directory {
    public getMostRecentFile(dir: string) {
        const files = this.orderReccentFiles(dir);
        return files.length > 0 ? files : [];
    }

    public orderReccentFiles(dir: string): string[] {
        const arrayFiles: string[] = [];
        const files = fs.readdirSync(dir);
        for (const file of files) {
            arrayFiles.push(file);
        }

        return arrayFiles;
    }

    public displayDirectory(dir: string) {
        const tableFiles = new Table({
            head: ['Id', 'File Name', 'Status'],
        });
        const path = `${pathBase}\\${dir}`;
        const lastAdrCreate: string[] = this.getMostRecentFile(path);
        for (const file of lastAdrCreate) {
            const seq = Number(file.slice(0, 4));
            const seqPadding = seq.toString().padStart(4, '0');
            tableFiles.push([
                seqPadding,
                file,
                'status',
            ]);
        }

        console.log(tableFiles.toString());
    }
}

export default Directory;
