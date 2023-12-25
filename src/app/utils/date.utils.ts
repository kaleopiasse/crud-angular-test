export class DateUtils {
  static formateDateToTimeStamp(datePtBr: string) {
    let datePtBrArray = datePtBr.split('/');
    return new Date(`${datePtBrArray[2]}-${datePtBrArray[1]}-${datePtBrArray[0]}T00:00`).getTime().toString();
  }
}
