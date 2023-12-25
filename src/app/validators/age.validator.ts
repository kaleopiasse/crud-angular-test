import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateUtils } from '../utils/date.utils';

export class AgeValidator {
  static validator(control: AbstractControl): ValidationErrors | null {

    const dateBirthTimeStamp = new Date(Number(DateUtils.formateDateToTimeStamp(control.value))).getTime();
    const age = ((new Date()).getTime() - dateBirthTimeStamp) / (1000 * 60 * 60 * 24 * 365);

    return age >= 18 && age <= 60 ? null : {invalidDateBirth: true};
  }
}
