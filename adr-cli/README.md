
Generar el registro de las deciciones de arquitectura (ADR).

## Tablad de contenido


## Instalacion

[![NPM Version](http://img.shields.io/npm/v/commander.svg?style=flat)](https://www.npmjs.com/package/adr-cli)
[![NPM Downloads](https://img.shields.io/npm/v/adr-cli.svg?style=flat)](https://npmcharts.com/compare/adr-cli?minimal=true)
[![Install Size](https://packagephobia.com/badge?p=adr-cli)](https://packagephobia.com/result?p=adr-cli)

```sh
npm install -g adr-cli
```

## Propiedades del CLI
```text
Usage: index [options] [command]

Options:
  -n, --new <string>  New ADR name
  -i, --index         Create index file into document directory. Considering the relative directory in which it is located.
  -s, --status        Change status of ADR (choices: "proposed", "acceptance", "rejection", "deprecation", "superseding")
  -h, --help          display help for command

Commands:
  show [dirs]         Show list of ADR files. For default is "doc/adr" in relative directory.
  config [options]    Command to configure properties for the cli.
  ```

  ## Uso
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

