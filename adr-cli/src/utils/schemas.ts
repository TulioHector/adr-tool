import Ajv from "ajv";
import chalk from 'chalk';

const ajv = new Ajv();

//Schema generate with https://extendsclass.com/json-schema-validator.html
function schema() {
    return {
        "definitions": {},
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "https://example.com/object1675292430.json",
        "title": "Root",
        "type": "object",
        "properties": {
            "adr-path": {
                "$id": "#root/adrPath",
                "title": "Adr-path",
                "type": "string",
                "default": "",
                "examples": [
                    "doc\\adr"
                ],
                "pattern": "^.*$"
            },
            "locale": {
                "$id": "#root/locale",
                "title": "Locale",
                "type": "string",
                "enum": ["en", "es"],
                "default": "en",
                "examples": [
                    "en"
                ],
                "pattern": "^.*$"
            },
            "markdownEngine": {
                "$id": "#root/markdownEngine",
                "title": "Markdownengine",
                "type": "string",
                "enum": ["github", "gitlab"],
                "default": "github",
                "examples": [
                    "github"
                ],
                "pattern": "^.*$"
            }
        }
    }

}
export class Schemas {
    public static validateConfigSchema(data: any) {
        let validate: any = ajv.compile(schema())
        let valid = validate(data)
        if (!valid) {
            let errors = validate.errors;
            errors.forEach((item: any) => {
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
}

export default Schemas;