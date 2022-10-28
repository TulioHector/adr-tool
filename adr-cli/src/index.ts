#! /usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import Conf from 'conf';
import { Banner } from './utils/banner.js';
import { Utils } from './utils/utils.js';
import { Adr } from './logic/adr.js';
import { Schemas } from './utils/schemas.js'
const config = new Conf();
const program = new Command();


Banner.SetBanner('ADR-CLI');
console.log(Banner.DisplayVersion());
program
    .name('adr-cli')
    .description('Architecrture Decision Recored')
    .configureOutput({
        // Visibly override write routines as example!
        //writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
        writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
        // Highlight errors in color.
        outputError: (str, write) => write(Utils.ErrorColor(str))
    })
    .showHelpAfterError(chalk.bold.yellowBright('(add --help for additional information)'))
    .version(Banner.DisplayVersion(), '-v, --version', 'output the current version');

program.addHelpText('after', `

    Example call config:
      $ adr-cli config get adr-path"
      $ adr-cli config set adr-path="<new_path>"`);



program.command('new')
    .description('Create a new ADR file into document directory. Considering the relative directory in which it is located.')
    .argument('[title]', 'Name of title for ADR')
    .action((title) => {
        let interactive = title === undefined ? true : false;
        if (interactive) {
            Adr.GetQuestionsToAdd().then((answers: any) => {
                console.log(JSON.stringify(answers, null, '  '));
                Adr.AddWithAnswers(answers);
            });
        } else {
            let data = {
                "shortTitle": title
            };
            Adr.AddWithoutAnswers(data);
        }
    });
program.command('index')
    .description('Create index file into document directory. Considering the relative directory in which it is located.')
    .action(() => {
        console.log(chalk.green("Reading ADR`s files to generated Index."));
        Adr.CreateIndex();
        process.exit();
    });

let configCmd = program
    .command('config')
    .description('Command to configure properties for the cli.')
    .action((options) => {
        console.log(`new path for adrs is ${options.doc}`);
        //process.exit();
    });
configCmd
    .command('get')
    .argument('<name>', 'Name of propertiy to view value.')
    .description('Command to get properties value.')
    .action((name) => {
        if (name !== undefined) {
            let nameCfg = config.get(name);
            if (nameCfg === undefined) {
                console.error(chalk.red("Propertiy is undefined."));
                //process.exit();
            }
            console.log(chalk.greenBright(`Value to property is: ${nameCfg}`));
        }
        console.log(chalk.redBright.bold(`Property not found. Please check the help.`));
        program.outputHelp();
    });
configCmd
    .command('set')
    .argument('<name>', 'Name of propertiy to setitng: propertiy=value')
    .description('Command to set propertie value.')
    .action((name) => {
        console.log(name);
        if (name !== undefined) {
            let parsePropertie: string[] = name.split('=');
            let prop: any = {};
            prop[parsePropertie[0]] = parsePropertie[1];

            let chk = Schemas.validateConfigSchema(prop);
            if (!chk)
                process.exit();

            config.set(parsePropertie[0], parsePropertie[1]);
            let newProp = config.get("adr-path");
            console.log(chalk.greenBright.bold(`Propertie ${parsePropertie[0]} changed to: ${newProp}`));
        }
        console.log(chalk.redBright.bold(`Property not found. Please check the help.`));
        program.outputHelp();
    });
configCmd
    .command('path')
    .description('Command to get the folder where is the config file for adr-tools.')
    .action(() => {
        console.log(`Configuration file create in this folder: ${chalk.cyan.bold(config.path)}`);
    });

program.parse(process.argv);
const options = program.opts();

