import {readdirSync} from 'node:fs';
import chalk from 'chalk';
import {Configuration} from './configurations.js';
import Adr from '../logic/adr.js';

const pathBase = process.cwd();
const config = new Configuration();
const adr = new Adr();
export class Utils {
  private static readonly pathAdr = config.get('adrPath');

  public errorColor(str: string) {
    // Add ANSI escape codes to display text in red.
    return `\x1b[31m${str}\x1b[0m`;
  }

  public static transformAdrColorToChalk(color: string, text: string) {
    switch(color) {
      case 'DodgerBlue': {
        return chalk.blue.bold(text);
      }
      case 'MediumSeaGreen': {
        return chalk.green.bold(text);
      }
      case 'Tomato': {
        return chalk.red.bold(text);
      }
      case 'Orange': {
        return chalk.cyan.bold(text);
      }
      case 'Violet': {
        return chalk.magenta.bold(text);
      }
      default: {
        return text;
      }
    }
  }

  public static getFileNameById(id: number): string {
    let matchedFiles = '';
    const pathdir = `${pathBase}\\${this.pathAdr}`;
    const files = readdirSync(pathdir);
    for (const file of files) {
        const seq = Number.parseInt(adr.getSequences(file), 10);
        if (seq === id) {
            matchedFiles = file;
            return matchedFiles;
        }
    }

    return matchedFiles;
}
}

export default Utils;
