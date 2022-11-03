import path from 'path';
import { Prefix } from './global-prefix.js';

export class Modules {
    private static nprefix:any = Prefix.getPrefix();

    public static getPath() {
      if (process.platform === 'win32' || process.env.OSTYPE === 'msys' || process.env.OSTYPE === 'cygwin') {
        return path.resolve(this.nprefix, 'node_modules');
      }
      return path.resolve(this.nprefix, 'lib/node_modules');
    }
}

export default Modules;