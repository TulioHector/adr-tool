
export class Utils {
    public static ErrorColor(str:string) {
        // Add ANSI escape codes to display text in red.
        return `\x1b[31m${str}\x1b[0m`;
      }
}


export default Utils;