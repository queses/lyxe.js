export class DebugUtil {
  static formatHrtime (time: number[]) {
    return `${time[0]}.${(time[1] / 10000000).toString().substr(2, 4)}s`
  }
}