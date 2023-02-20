#! /usr/bin/env node

import chalk from 'chalk';
import {Command} from 'commander';
import {Banner} from './utils/banner.js';
import {Utils} from './utils/utils.js';
import {Adr, Status} from './logic/adr.js';
import {Directory} from './logic/directory.js';
import {Schemas} from './utils/schemas.js';
import {Configuration} from './utils/configurations.js';
import {Locale} from './utils/locale.js';
import type {ILocale} from './utils/ilocale.js';

const locale: ILocale = Locale.getInstance().getLocale();
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
      $ adr-cli config get adrPath"
      $ adr-cli config set adrPath="<new_path>"`);

program.command('new')
    .description(locale.command.new.program.descriptions)
    .argument('[title]', locale.command.new.program.arguments)
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
    .description(locale.command.index.program.descriptions)
    .action(() => {
        adr.createIndex();
        process.exitCode = 1;
    });

program
    .command('show')
    .description(locale.command.show.program.descriptions)
    .action(() => {
        const dir: string = config.get('adrPath');
        directory.displayDirectory(dir);
    });

program
    .command('init')
    .description(locale.command.init.program.description)
    .action(() => {
        const dir: string = config.get('adrPath');
        const result: boolean = directory.initDirectory(dir);
        if (result) {
            console.log(chalk.redBright.bold(locale.command.init.program.messages.successfully));
        } else {
            console.log(chalk.redBright.bold(locale.command.init.program.messages.wrong));
        }
    });

program
    .command('status')
    .description(locale.command.status.program.descriptions)
    .argument('[id]', locale.command.status.program.argument, status.setDefaultStatus, '0')
    .option('-s,--status <new_status>', locale.command.status.program.option)
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

program
    .command('rel')
    .description(locale.command.rel.program.description)
    .argument('[id]', locale.command.rel.program.argument, adr.setDefaultRel, '0')
    .option('-t,--to <id_adr>', locale.command.rel.program.option)
    .action(async (id: string, adrToRelation: Record<string, string>) => {
        const sourceId = Number.parseInt(id, 10);
        const destinationId = adrToRelation.to.split(' ');
        adr.addRelationToAdr(sourceId, destinationId);
    });

const configCmd = program
    .command('config')
    .description(locale.command.config.program.descriptions)
    .action((options: Record<string, string>) => {
        console.log(`new path for adrs is ${options.doc}`);
    });
configCmd
    .command('get')
    .argument('<name>', locale.command.config.get.argument)
    .description(locale.command.config.get.description)
    .action((name: string | undefined) => {
        if (name !== undefined) {
            const nameCfg = config.get(name);
            if (nameCfg === undefined) {
                console.error(chalk.red(locale.command.config.get.messages.propertyNotValid));
            }

            console.log(chalk.greenBright(`${locale.command.config.get.messages.propertyName} ${nameCfg}`));
            process.exit(1);
        }

        console.log(chalk.redBright.bold(locale.command.config.get.messages.propertyNotFound));
        program.outputHelp();
    });
configCmd
    .command('set')
    .argument('<name>', locale.command.config.set.argument)
    .description(locale.command.config.set.description)
    .action((name: string | undefined) => {
        if (name !== undefined) {
            const parsePropertie: string[] = name.split('=');
            const prop: Record<string, any> = {};
            prop[parsePropertie[0]] = parsePropertie[1];

            const chk = Schemas.validateConfigSchema(prop);
            if (!chk) {
                const messages: string = locale.command.config.set.messages.propertyEntered.replace('$parseProperty', parsePropertie[0]);
                console.log(chalk.greenBright.bold(messages));
                process.exit(1);
            }

            config.set(parsePropertie[0], parsePropertie[1]);
            const newProp = config.get(parsePropertie[0]);
            console.log(chalk.greenBright.bold(locale.command.config.set.messages.propertyChanged.replace('${parsePropertie[0]}', parsePropertie[0]).replace('${newProp}', newProp)));
            process.exit(1);
        }

        console.log(chalk.redBright.bold(locale.command.config.set.messages.propertyNotFound));
        program.outputHelp();
    });
configCmd
    .command('path')
    .description(locale.command.config.path.description)
    .action(() => {
        config.getCurrentPath();
    });
configCmd
    .command('reset')
    .description(locale.command.config.reset.description)
    .action(() => {
        config.setDefaultValues({
            adrPath: 'doc\\adr',
            locale: 'en',
            markdownEngine: 'github',
        });
        config.resetConfig();
    });
configCmd
    .command('show')
    .description(locale.command.config.show.description)
    .action(() => {
        config.displayPropertiesValues();
    });

program.parse(process.argv);
const options = program.opts();

function exit() {
    process.exitCode = 1;
}

process.on('uncaughtException', exit);
process.on('SIGINT', exit);
