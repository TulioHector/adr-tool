import {existsSync, mkdirSync, readdirSync} from 'node:fs';
import LineByLine from 'n-readlines';
import Table from 'cli-table3';
import Utils from '../utils/utils.js';

const pathBase = process.cwd();
export class Directory {
    public static getStatusForAdr(adrName: string, path: string): string {
        const liner = new LineByLine(`${path}\\${adrName}`);
        let line = liner.next();
        let lineNumber = 0;
        while (line) {
            const lineString = line.toString('ascii');
            if (lineString.includes('* Status:')) {
                const parse = lineString.split('* Status:');
                return parse[1];
            }
            lineNumber++;
            line = liner.next();
        }
        return 'status not found';
    }

    public getMostRecentFile(directory: string) {
        const files = this.orderReccentFiles(directory);
        return files.length > 0 ? files : [];
    }

    public orderReccentFiles(directory: string): string[] {
        const arrayFiles: string[] = [];
        const files = readdirSync(directory);
        for (const file of files) {
            arrayFiles.push(file);
        }

        return arrayFiles;
    }

    public displayDirectory(directory: string) {
        const tableFiles = new Table({
            head: ['Id', 'File Name', 'Status'],
        });
        const path = `${pathBase}\\${directory}`;
        const lastAdrCreate: string[] = this.getMostRecentFile(path);
        for (const file of lastAdrCreate) {
            const statusAdr = Directory.getStatusForAdr(file, path);
            const matches = statusAdr.matchAll(/{([^}]*)}/g);
            const matches2 = Array.from(matches);
            const textColor = matches2[0][1];
            const textStatus = matches2[1][1];
            const seq = Number(file.slice(0, 4));
            const seqPadding = seq.toString().padStart(4, '0');
            tableFiles.push([
                seqPadding,
                file,
                Utils.transformAdrColorToChalk(textColor, textStatus),
            ]);
        }

        console.log(tableFiles.toString());
    }

    public initDirectory(directory: string): boolean {
        if (!existsSync(directory)) {
            mkdirSync(directory, {recursive: true});
            return true;
        }
        return false;
    }
}

export default Directory;
