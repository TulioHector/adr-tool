import table from 'cli-table3';
const pathBase = process.cwd();
import fs from 'fs';

const orderReccentFiles = (dir) => {
    let arrFiles = [];
    fs.readdirSync(dir).forEach(file => {
        arrFiles.push(file);
    });
    return arrFiles;
};

//{ file: 'db-2020-08-03-12:13.sql', mtime: 2020-08-03T16:13:46.000Z }
export const getMostRecentFile = (dir) => {
    let files = orderReccentFiles(dir);
    return files.length ? files : undefined;
};

export default function displayDirectory(dir) {
    let tableFiles = new table({
        head: ['Id', 'File Name', 'Status']
    });
    let path = `${pathBase}\\${dir}`;
    let lastAdrCreate = getMostRecentFile(path);
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

