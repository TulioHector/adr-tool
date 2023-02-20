import {existsSync, mkdirSync, readdirSync} from 'node:fs';
import LineByLine from 'n-readlines';
import Table from 'cli-table3';
import Utils from '../utils/utils.js';

const pathBase = process.cwd();
export class Directory {
    public getMostRecentFile(dir: string) {
        const files = this.orderReccentFiles(dir);
        return files.length > 0 ? files : [];
    }

    public orderReccentFiles(dir: string): string[] {
        const arrayFiles: string[] = [];
        const files = readdirSync(dir);
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

    public initDirectory(dir: string): boolean {
        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
            return true;
        }
        return false;
    }

    public static getStatusForAdr(adrName: string, path: string): string {
        const liner = new LineByLine(`${path}\\${adrName}`);
        let line;
        let lineNumber = 0;
        while (line = liner.next()) {
            const lineString = line.toString('ascii');
            if (lineString.includes('* Status:')) {
                const parse = lineString.split('* Status:');
                return parse[1];
            }
            lineNumber++;
        }
        return "status not found";
    }
}

export default Directory;
