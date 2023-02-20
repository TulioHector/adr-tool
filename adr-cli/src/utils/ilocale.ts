//https://app.quicktype.io/
// To parse this data:
//
//   import { Convert, ILocale } from "./file";
//
//   const iLocale = Convert.toILocale(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ILocale {
    command: Command;
    class:   Class;
}

export interface Class {
    adr: Adr;
}

export interface Adr {
    add: Add;
    adr: AdrClass;
}

export interface Add {
    checkContextValid: string;
}

export interface AdrClass {
    validateOrCreateIndex: ValidateOrCreateIndex;
}

export interface ValidateOrCreateIndex {
    reading:   string;
    generated: string;
}

export interface Command {
    config: Config;
    new:    New;
    index:  Index;
    show:   Index;
    status: Status;
    init:   Init;
}

export interface Config {
    program: ConfigProgram;
    show:    Show;
    get:     Get;
    set:     Set;
    reset:   Path;
    path:    Path;
}

export interface Get {
    argument:    string;
    description: string;
    messages:    GetMessages;
}

export interface GetMessages {
    propertyNotFound: string;
    propertyNotValid: string;
    propertyName:     string;
}

export interface Path {
    description: string;
}

export interface ConfigProgram {
    descriptions: string;
}

export interface Set {
    argument:    string;
    description: string;
    messages:    SetMessages;
}

export interface SetMessages {
    propertyEntered:  string;
    propertyChanged:  string;
    propertyNotFound: string;
}

export interface Show {
    description: string;
    table:       Table;
}

export interface Table {
    columnName: string[];
    rows:       Rows;
}

export interface Rows {
    adrPath:        string;
    locale:         string;
    markdownEngine: string;
}

export interface Index {
    program: ConfigProgram;
}

export interface Init {
    program: InitProgram;
}

export interface InitProgram {
    description: string;
    messages:    ProgramMessages;
}

export interface ProgramMessages {
    successfully: string;
    wrong:        string;
}

export interface New {
    withAnswers:    WithAnswers;
    withOutAnswers: WithOutAnswers;
    program:        NewProgram;
}

export interface NewProgram {
    descriptions: string;
    arguments:    string;
}

export interface WithAnswers {
    shortTitle:         string;
    contextDescription: string;
}

export interface WithOutAnswers {
}

export interface Status {
    program: StatusProgram;
}

export interface StatusProgram {
    descriptions: string;
    argument:     string;
    option:       string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toILocale(json: string): ILocale {
        return cast(JSON.parse(json), r("ILocale"));
    }

    public static iLocaleToJson(value: ILocale): string {
        return JSON.stringify(uncast(value, r("ILocale")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "ILocale": o([
        { json: "command", js: "command", typ: r("Command") },
        { json: "class", js: "class", typ: r("Class") },
    ], false),
    "Class": o([
        { json: "adr", js: "adr", typ: r("Adr") },
    ], false),
    "Adr": o([
        { json: "Add", js: "add", typ: r("Add") },
        { json: "Adr", js: "adr", typ: r("AdrClass") },
    ], false),
    "Add": o([
        { json: "checkContextValid", js: "checkContextValid", typ: "" },
    ], false),
    "AdrClass": o([
        { json: "validateOrCreateIndex", js: "validateOrCreateIndex", typ: r("ValidateOrCreateIndex") },
    ], false),
    "ValidateOrCreateIndex": o([
        { json: "reading", js: "reading", typ: "" },
        { json: "generated", js: "generated", typ: "" },
    ], false),
    "Command": o([
        { json: "config", js: "config", typ: r("Config") },
        { json: "new", js: "new", typ: r("New") },
        { json: "index", js: "index", typ: r("Index") },
        { json: "show", js: "show", typ: r("Index") },
        { json: "status", js: "status", typ: r("Status") },
        { json: "init", js: "init", typ: r("Init") },
    ], false),
    "Config": o([
        { json: "program", js: "program", typ: r("ConfigProgram") },
        { json: "show", js: "show", typ: r("Show") },
        { json: "get", js: "get", typ: r("Get") },
        { json: "set", js: "set", typ: r("Set") },
        { json: "reset", js: "reset", typ: r("Path") },
        { json: "path", js: "path", typ: r("Path") },
    ], false),
    "Get": o([
        { json: "argument", js: "argument", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "messages", js: "messages", typ: r("GetMessages") },
    ], false),
    "GetMessages": o([
        { json: "propertyNotFound", js: "propertyNotFound", typ: "" },
        { json: "propertyNotValid", js: "propertyNotValid", typ: "" },
        { json: "propertyName", js: "propertyName", typ: "" },
    ], false),
    "Path": o([
        { json: "description", js: "description", typ: "" },
    ], false),
    "ConfigProgram": o([
        { json: "descriptions", js: "descriptions", typ: "" },
    ], false),
    "Set": o([
        { json: "argument", js: "argument", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "messages", js: "messages", typ: r("SetMessages") },
    ], false),
    "SetMessages": o([
        { json: "propertyEntered", js: "propertyEntered", typ: "" },
        { json: "propertyChanged", js: "propertyChanged", typ: "" },
        { json: "propertyNotFound", js: "propertyNotFound", typ: "" },
    ], false),
    "Show": o([
        { json: "description", js: "description", typ: "" },
        { json: "table", js: "table", typ: r("Table") },
    ], false),
    "Table": o([
        { json: "columnName", js: "columnName", typ: a("") },
        { json: "rows", js: "rows", typ: r("Rows") },
    ], false),
    "Rows": o([
        { json: "adrPath", js: "adrPath", typ: "" },
        { json: "locale", js: "locale", typ: "" },
        { json: "markdownEngine", js: "markdownEngine", typ: "" },
    ], false),
    "Index": o([
        { json: "program", js: "program", typ: r("ConfigProgram") },
    ], false),
    "Init": o([
        { json: "program", js: "program", typ: r("InitProgram") },
    ], false),
    "InitProgram": o([
        { json: "description", js: "description", typ: "" },
        { json: "messages", js: "messages", typ: r("ProgramMessages") },
    ], false),
    "ProgramMessages": o([
        { json: "successfully", js: "successfully", typ: "" },
        { json: "wrong", js: "wrong", typ: "" },
    ], false),
    "New": o([
        { json: "withAnswers", js: "withAnswers", typ: r("WithAnswers") },
        { json: "WithOutAnswers", js: "withOutAnswers", typ: r("WithOutAnswers") },
        { json: "program", js: "program", typ: r("NewProgram") },
    ], false),
    "NewProgram": o([
        { json: "descriptions", js: "descriptions", typ: "" },
        { json: "arguments", js: "arguments", typ: "" },
    ], false),
    "WithAnswers": o([
        { json: "shortTitle", js: "shortTitle", typ: "" },
        { json: "contextDescription", js: "contextDescription", typ: "" },
    ], false),
    "WithOutAnswers": o([
    ], false),
    "Status": o([
        { json: "program", js: "program", typ: r("StatusProgram") },
    ], false),
    "StatusProgram": o([
        { json: "descriptions", js: "descriptions", typ: "" },
        { json: "argument", js: "argument", typ: "" },
        { json: "option", js: "option", typ: "" },
    ], false),
};
