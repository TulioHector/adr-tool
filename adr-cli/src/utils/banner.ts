import chalk from 'chalk';
import figlet from 'figlet';
import { readFileSync } from 'fs';
import { ModulesPath } from './managePath.js';

export class Banner {
  public setBanner(msn: string) {
    console.log(chalk.bold.cyan(figlet.textSync(msn, {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })));
  }

  public displayVersion(): string {
    let result = JSON.parse(readFileSync(`${ModulesPath.getInstalledPathSync('adr-cli')}\\package.json`, {encoding:'utf8', flag:'r'}));
    let displayVersion = `Version ${result.version} \nAuthor: Hector Romano`;
    return chalk.bold.cyan(displayVersion);
  };
}
export default Banner;