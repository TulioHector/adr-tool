#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import { Command } from 'commander';
import displayDirectory from './commands/directory.js'
import createAdrIndex from './commands/indexingadr.js';
import CheckConfigFileExistsSync from './utils/configurations.js';
import { createFileImediatly, queryParams, createFile, setStatusToAdr } from './commands/adr.js';
import validateConfigSchema from './utils/schemas.js';
import Conf from 'conf';
const config = new Conf();
const program = new Command();


//create file if is not exist and set adr path
let isExistConfig = CheckConfigFileExistsSync(config.path);
if (!isExistConfig) {
  config.set('adr-path', "doc\\adr");
}

//console.log(config.path);
// Mostrar un banner con un mensaje formado por caracteres.
const msn = msn => {
  console.log(chalk.bold.cyan(figlet.textSync(msn, {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  })));
};

const displayVersion = (displayVersion) => {
  console.log(chalk.bold.cyan(displayVersion));
};

const setDefaultDirectopry = (value, defaultValue) => {
  console.log("Este es el valor:" + value, defaultValue);
  return value;
}

const setDefaultStatus = (value, defaultValue) => {
  console.log("Este es el valor del status:" + value, defaultValue);
  return value;
}

const errorColor = (str) => {
  // Add ANSI escape codes to display text in red.
  return `\x1b[31m${str}\x1b[0m`;
}
// IIFE (Immediately Invoked Function Expression)
(async () => {
  msn('ADR-CLI');
  program
    .name('adr-cli')
    .description('Architecrture Decision Recored')
    .configureOutput({
      // Visibly override write routines as example!
      writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
      writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
      // Highlight errors in color.
      outputError: (str, write) => write(errorColor(str))
    })
    .showHelpAfterError(chalk.bold.yellowBright('(add --help for additional information)'))
    .version(displayVersion('Version 0.1.5 \nAuthor: Hector Romano'), '-v, --version', 'output the current version');

  program.addHelpText('after', `

  Example call config:
    $ adr-cli config get adr-path"
    $ adr-cli config set adr-path="<new_path>"`);


  program
    .command('status')
    .description('Modify the status an ADR by id. The status chooice: proposed, acceptance, rejection, deprecation, superseding')
    .argument('[id]', 'Default "0', setDefaultStatus, '0')
    .option('-s,--status <new_status>', 'Set or change status for adr. The status chooice: proposed, acceptance, rejection, deprecation, superseding')
    .action((id, data) => {
      let newStatus = data.status;
      let idAdr = parseInt(id, newStatus);
      setStatusToAdr(idAdr, newStatus);
      console.log("entre a action status con id: ", id, "ccon estatus ", newStatus);
      process.exit();
    });

  program
    .command('show')
    .description('Show list of ADR files. For default is "doc/adr" in relative directory.')
    .action(() => {
      let dir = config.get('adr-path');
      displayDirectory(dir);
      process.exit();
    });

  let configCmd = program
    .command('config')
    .description('Command to configure properties for the cli.')
    .action((options) => {
      console.log(`new path for adrs is ${options.doc}`);
      process.exit();
    });
  configCmd
    .command('get')
    .argument('<name>')
    .description('Command to get properties value.')
    .action((name) => {
      let nameCfg = config.get(name);
      if (nameCfg === undefined) {
        console.error(chalk.red("Propertiy is undefined."));
        process.exit();
      }
      console.log(chalk.greenBright(`Value to property is: ${nameCfg}`));
    });

  configCmd
    .command('set')
    .argument('[name]', 'Name of propertiy to seting: propertiy=value')
    .description('Command to set propertie value.')
    .action((name) => {
      let parsePropertie = name.split('=');
      let prop = {};
      prop[parsePropertie[0]] = parsePropertie[1];

      let chk = validateConfigSchema(prop);
      if (!chk)
        process.exit();

      config.set(parsePropertie[0], parsePropertie[1]);
      let newProp = config.get("adr-path");
      console.log(chalk.greenBright.bold(`Propertie ${parsePropertie[0]} changed to: ${newProp}`));
    });

  configCmd
    .command('path')
    .description('Command to get the folder where is the config file for adr-tools.')
    .action(() => {
      console.log(`Configuration file create in this folder: ${chalk.cyan.bold(config.path)}`);
    });

  program.command('index')
    .description('Create index file into document directory. Considering the relative directory in which it is located.')
    .action(() => {
      console.log(chalk.green("Reading ADR`s files to generated Index."));
      createAdrIndex();
      process.exit();
    })

  program.option('-n, --new <string>', 'New ADR name')
    .action((title) => {
      console.log("HOla TIto estoy aca en el new adr", title.new);
      let interactive = title.new === undefined ? true : false;
      if (interactive) {
        queryParams().then((answers) => {
          console.log(JSON.stringify(answers, null, '  '));
          createFile(answers);
        });
      } else {
        let data = {
          "shortTitle": title.new
        };
        createFileImediatly(data);
      }
    });
  program.action(() => {
    program.help()
  })

  await program.parseAsync(process.argv);
})();