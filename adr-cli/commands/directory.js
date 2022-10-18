import chalk from 'chalk';
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
    let path = `${pathBase}\\${dir}`;
    let lastAdrCreate = getMostRecentFile(path);
    lastAdrCreate.forEach(file => {
        console.log(file), "estoy aqui?";
    });
}

