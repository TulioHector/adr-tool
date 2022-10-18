#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import { Command, Option } from 'commander';
import displayDirectory from './commands/directory.js'
import createAdrIndex from './commands/indexingadr.js';
import { createFileImediatly, queryParams, createFile, setStatusToAdr } from './commands/adr.js';
import Conf from 'conf';
const config = new Conf();
const program = new Command();

//set default folder to store adr`s files
config.set('adr-path', 'doc/adr');
console.log(config.path);
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
      setStatusToAdr(idAdr, newStatus) ;
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
    if(nameCfg === undefined){
      console.error(chalk.red("Propertiy is undefined."));
      process.exit();
    }
    configCmd
    .command('set')
    .argument('<name>')
    .description('Command to set propertie value.')
    .action((name)=> {
      let nameCfg = config.get(name);

      let parseName = nameCfg.split('=');
      config.set(parseName[0], parseName[1]);
    })

    console.log(chalk.greenBright(`Value to property es: ${nameCfg}`));
  });

  // program.addOption(new Option('-s, --status', 'Change status of ADR').choices(['proposal', 'acceptance', 'rejection', 'deprecation', 'superseding'])).action(()=>{
  //   process.exit();
  // })

  program.command('index')
  .description('Create index file into document directory. Considering the relative directory in which it is located.')
  .action(()=> {
    console.log(chalk.yellowBright("Reading ADR`s files to generated Index."));
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
    //process.exit();
  });
  program.action(() => {
    program.help()
})
//console.log(program);
  // console.log("Cantidad de argumentos o parametros:", process.argv.length);
  // if (process.argv.length <= 3) {
  //   program.help()
  // }else{
  //   await program.parseAsync(process.argv);
  // }
  await program.parseAsync(process.argv);
})();