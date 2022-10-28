import chalk from 'chalk';
import figlet from 'figlet';
import { readFileSync } from 'fs';
const pathBase = process.cwd();

export class Banner {
  public static SetBanner(msn: string) {
    console.log(chalk.bold.cyan(figlet.textSync(msn, {
      font: 'ANSI Shadow',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })));
  }

  public static DisplayVersion(): string {
    let result = JSON.parse(readFileSync(`${pathBase}\\package.json`, {encoding:'utf8', flag:'r'}));
    let displayVersion = `Version ${result.version} \nAuthor: Hector Romano`;
    return chalk.bold.cyan(displayVersion);
  };
}
export default Banner;