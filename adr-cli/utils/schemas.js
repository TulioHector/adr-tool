import Ajv from "ajv";
import fs from 'fs';
import Conf from 'conf';
import chalk from 'chalk';
const config = new Conf();

const ajv = new Ajv();
// let currentConfig = fs.readFileSync(config.path, { encoding: 'utf8', flag: 'r' });
// console.log(currentConfig);

//Schema generate with https://extendsclass.com/json-schema-validator.html
function schema() {
    return {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#", 
        "$id": "https://example.com/object1666202848.json", 
        "title": "Root", 
        "type": "object",
        "required": [
            "adr-path"
        ],
        "properties": {
            "adr-path": {
                "$id": "#root/adr-path", 
                "title": "Adr-path", 
                "type": "string",
                "default": "",
                "examples": [
                    "doc\\adr"
                ],
                "pattern": "^.*$"
            }
        }
    }    
}

export default function validateConfigSchema(data){
    let validate = ajv.compile(schema())
    let valid = validate(data)
    if (!valid) {
        let errors =validate.errors;
        errors.forEach(item => {
            console.error(`
            Error propertie definition:
            keyword: ${chalk.red.bold(item.keyword)}
            missingProperty: ${chalk.red.bold(item.params.missingProperty)}
            menssage: ${chalk.red.bold(item.message)}
            `);
        });
        
        return false;
    }

    return true;
}