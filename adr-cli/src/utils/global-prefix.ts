
import fs from 'fs';
import os from 'os';
import path from 'path';
import { Ini } from './ini.js';

export class Prefix {
    private static prefix: any;

    public static getPrefix() {
        if (process.env.PREFIX) return process.env.PREFIX;
        if (this.prefix) return this.prefix;

        // Start by checking if the global prefix is set by the user
        let home = os.homedir();

        // os.homedir() returns undefined if $HOME is not set; path.resolve requires strings
        if (home) {
            this.prefix = this.tryConfigPath(path.resolve(home, '.npmrc'));
        }

        if (this.prefix) {
            return this.prefix;
        }

        // Otherwise find the path of npm
        let npm = this.tryNpmPath();
        if (npm) {
            // Check the built-in npm config file
            this.prefix = this.tryConfigPath(path.resolve(npm, '..', '..', 'npmrc'));

            if (this.prefix) {
                // Now the global npm config can also be checked.
                this.prefix = this.tryConfigPath(path.resolve(this.prefix, 'etc', 'npmrc')) || this.prefix;
            }
        }

        if (!this.prefix) {
            let { APPDATA, DESTDIR, OSTYPE } = process.env;

            // c:\node\node.exe --> prefix=c:\node\
            if (process.platform === 'win32' || OSTYPE === 'msys' || OSTYPE === 'cygwin') {
                this.prefix = APPDATA ? path.join(APPDATA, 'npm') : path.dirname(process.execPath);
                return this.prefix;
            }

            // /usr/local/bin/node --> prefix=/usr/local
            this.prefix = path.dirname(path.dirname(process.execPath));

            // destdir only is respected on Unix
            if (DESTDIR) {
                this.prefix = path.join(DESTDIR, this.prefix);
            }
        }

        return this.prefix;
    }

    private static tryNpmPath() {
        try {
            return fs.realpathSync(require('which').sync('npm'));
        } catch (err) { /* do nothing */ }
    }

    private static tryConfigPath(configPath: string) {
        try {
            return Ini.parse(fs.readFileSync(configPath, 'utf-8')).prefix;
        } catch (err) { /* do nothing */ }
    }
}

export default Prefix;