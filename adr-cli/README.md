
[![NPM Version](http://img.shields.io/npm/v/adr-cli.svg?style=flat)](https://www.npmjs.com/package/adr-cli)
[![NPM Downloads](https://img.shields.io/npm/dm/adr-cli.svg?style=flat)](https://npmcharts.com/compare/adr-cli?minimal=true)
[![Install Size](https://packagephobia.com/badge?p=adr-cli)](https://packagephobia.com/result?p=adr-cli)


Generar el registro de las deciciones de arquitectura (ADR).

## Tablad de contenido


## Instalacion

```sh
npm install -g adr-cli
```

For more information go to npmjs [adr-cli](https://www.npmjs.com/package/adr-cli).

## Propiedades del CLI
```text
Usage: adr-cli [options] [command]

Architecrture Decision Recored

Options:
  -v, --version   output the current version
  -h, --help      display help for command

Commands:
  new [title]     Create a new ADR file into document directory. Considering the relative directory in which it is located.
  index           Create index file into document directory. Considering the relative directory in which it is located.
  config          Command to configure properties for the cli.
  help [command]  display help for command


    Example call config:
      $ adr-cli config get adr-path"
      $ adr-cli config set adr-path="<new_path>"
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

