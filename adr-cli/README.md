
[![NPM Version](http://img.shields.io/npm/v/adr-cli.svg?style=flat)](https://www.npmjs.com/package/adr-cli)
[![NPM Downloads](https://img.shields.io/npm/dm/adr-cli.svg?style=flat)](https://npmcharts.com/compare/adr-cli?minimal=true)
[![Install Size](https://packagephobia.com/badge?p=adr-cli)](https://packagephobia.com/result?p=adr-cli)
[![License](https://img.shields.io/npm/l/adr-cli.svg)](https://github.com/TulioHector/adr-tool/blob/main/adr-cli/package.json)


Generar el registro de las deciciones de arquitectura (ADR).

## Tablad de contenido


## Instalacion

```sh
npm install -g adr-cli
```

For more information go to npmjs [adr-cli](https://www.npmjs.com/package/adr-cli).

## Propiedades del CLI
```sh
Usage: adr-cli [options] [command]

Architecrture Decision Recored

Options:
  -v, --version          output the current version
  -h, --help             display help for command

Commands:
  new [title]            Create a new ADR file into document directory. Considering the relative directory in which it is located.
  index                  Create index file into document directory. Considering the relative directory in which it is located.
  show                   Show list of ADR files. For default is "doc/adr" in relative directory.
  status [options] [id]  Modify the status an ADR by id. The status chooice: proposed, acceptance, rejection, deprecation, superseding
  config                 Command to configure properties for the cli.
  help [command]         display help for command


    Example call config:
      $ adr-cli config get adr-path"
      $ adr-cli config set adr-path="<new_path>"
  ```

## New ADR
### Command line:
```sh
$ adr-cli new -h
```
Ooutput:
```sh
Usage: adr-cli new [options] [title]

Create a new ADR file into document directory. Considering the relative directory in which it is located.

Arguments:
  title       Name of title for ADR

Options:
  -h, --help  display help for command

```

## Generate Index of ADR`s
```sh
$ adr-cli index -h
```
Ooutput:
```sh
Usage: adr-cli index [options]

Create index file into document directory. Considering the relative directory in which it is located.

Options:
  -h, --help  display help for command
```
## Show list of ADR files
```sh
$ adr-cli show -h
```
Ooutput:
```sh
Usage: adr-cli show [options]

Show list of ADR files. For default is "doc/adr" in relative directory.

Options:
  -h, --help  display help for command
```

## Show and modify status of ADR
```sh
$ adr-cli status -h
```
Ooutput:
```sh
Usage: adr-cli status [options] [id]

Modify the status an ADR by id. The status chooice: proposed, acceptance, rejection, deprecation, superseding

Arguments:
  id                        Default "0 (default: "0")

Options:
  -s,--status <new_status>  Set or change status for adr. The status chooice: proposed, acceptance, rejection, deprecation, superseding
  -h, --help                display help for command
```

## Show and modify config settings of adr-cli
```sh
$ adr-cli config -h
```
Ooutput:
```sh
Usage: adr-cli config [options] [command]

Command to configure properties for the cli.

Options:
  -h, --help  display help for command

Commands:
  get <name>  Command to get properties value.
  set <name>  Command to set propertie value.
  path        Command to get the folder where is the config file for adr-tools.
  reset       Command to reset or regenerate the config file for defaults.
```
  ### Ejemplo
  

## Estados ADR

Los estados posibles son los siguientes:

| Estado      |   Color                               |
| :---------- | :-----------------------------------: |
| proposed    | $\color{DodgerBlue}{proposed}$        |
| acceptance  | $\color{MediumSeaGreen}{acceptance}$  |
| rejection   | $\color{Tomato}{rejection}$           |
| deprecation | $\color{Orange}{deprecation}$         |
| superseding | $\color{Violet}{superseding}$         |

