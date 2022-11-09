#! /usr/bin/env node

import chalk from 'chalk';
import {Command} from 'commander';
import {Banner} from './utils/banner.js';
import {Utils} from './utils/utils.js';
import {Adr, Status} from './logic/adr.js';
import {Directory} from './logic/directory.js';
import {Schemas} from './utils/schemas.js';
import {Configuration} from './utils/configurations.js';

const config = new Configuration();
const program = new Command();
const adr = new Adr();
const status = new Status();
const directory = new Directory();
const banner = new Banner();
const utils = new Utils();

banner.setBanner('ADR-CLI');

program
    .name('adr-cli')
    .description('Architecrture Decision Recored')
    .configureOutput({
        writeErr: (string_: string) => process.stdout.write(`[ERR] ${string_}`),
    })
    .showHelpAfterError(chalk.bold.yellowBright('(add --help for additional information)'))
    .version(banner.displayVersion(), '-v, --version', 'output the current version');

program.addHelpText('after', `

    Example call config:
      $ adr-cli config get adr-path"
      $ adr-cli config set adr-path="<new_path>"`);

program.command('new')
    .description('Create a new ADR file into document directory. Considering the relative directory in which it is located.')
    .argument('[title]', 'Name of title for ADR')
    .action(async (title: string) => {
        const interactive = title === undefined;
        if (interactive) {
            const questions = await adr.getQuestionsToAdd();
            adr.addWithAnswers(questions);
        } else {
            const data: any = {
                shortTitle: title,
            };
            adr.addWithoutAnswers(data);
        }
    });
program.command('index')
    .description('Create index file into document directory. Considering the relative directory in which it is located.')
    .action(() => {
        console.log(chalk.green('Reading ADR`s files to generated Index.'));
        adr.createIndex();
        process.exitCode = 1;
    });

program
    .command('show')
    .description('Show list of ADR files. For default is "doc/adr" in relative directory.')
    .action(() => {
        const dir: string = config.get('adr-path');
        directory.displayDirectory(dir);
    });

program
    .command('status')
    .description('Modify the status an ADR by id. The status chooice: proposed, acceptance, rejection, deprecation, superseding')
    .argument('[id]', 'Default "0', status.setDefaultStatus, '0')
    .option('-s,--status <new_status>', 'Set or change status for adr. The status chooice: proposed, acceptance, rejection, deprecation, superseding')
    .action(async (id: string, data: Record<string, string>) => {
        const newStatus = data.status;
        const idAdr = Number.parseInt(id, 10);
        if (newStatus === undefined) {
            const answers: Record<string, string> = await status.getStatus();
            status.setStatusToAdr(idAdr, answers.status);
        } else {
            status.setStatusToAdr(idAdr, newStatus);
        }
    });

const configCmd = program
    .command('config')
    .description('Command to configure properties for the cli.')
    .action((options: Record<string, string>) => {
        console.log(`new path for adrs is ${options.doc}`);
    });
configCmd
    .command('get')
    .argument('<name>', 'Name of propertiy to view value.')
    .description('Command to get properties value.')
    .action((name: string | undefined) => {
        if (name !== undefined) {
            const nameCfg = config.get(name);
            if (nameCfg === undefined) {
                console.error(chalk.red('Propertiy is undefined.'));
            }

            console.log(chalk.greenBright(`Value to property is: ${nameCfg}`));
            process.exit(1);
        }

        console.log(chalk.redBright.bold('Property not found. Please check the help.'));
        program.outputHelp();
    });
configCmd
    .command('set')
    .argument('<name>', 'Name of propertiy to setitng: propertiy=value')
    .description('Command to set propertie value.')
    .action((name: string | undefined) => {
        if (name !== undefined) {
            const parsePropertie: string[] = name.split('=');
            const prop: Record<string, any> = {};
            prop[parsePropertie[0]] = parsePropertie[1];

            const chk = Schemas.validateConfigSchema(prop);
            if (!chk) {
                console.log(chalk.greenBright.bold(`Property entered, ${parsePropertie[0]}, is not valid into the schema. Please tried again.`));
                process.exit(1);
            }

            config.set(parsePropertie[0], parsePropertie[1]);
            const newProp = config.get('adr-path');
            console.log(chalk.greenBright.bold(`Propertie ${parsePropertie[0]} changed to: ${newProp}`));
            process.exit(1);
        }

        console.log(chalk.redBright.bold('Property not found. Please check the help.'));
        program.outputHelp();
    });
configCmd
    .command('path')
    .description('Command to get the folder where is the config file for adr-tools.')
    .action(() => {
        console.log(`Configuration file create in this folder: ${chalk.cyan.bold(config.path)}`);
    });
configCmd
    .command('reset')
    .description('Command to reset or regenerate the config file for defaults.')
    .action(() => {
        config.setDefaultValues({
            'adr-path': 'doc\\adr',
        });
        console.log(`CConfigurations file reset successfully in this folder: ${chalk.cyan.bold(config.path)}`);
    });

program.parse(process.argv);
const options = program.opts();

function exit() {
    process.exitCode = 1;
}

process.on('uncaughtException', exit);
process.on('SIGINT', exit);
