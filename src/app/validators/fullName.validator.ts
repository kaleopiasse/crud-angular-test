import { AbstractControl, ValidationErrors } from '@angular/forms';

export class FullNameValidator {
  static validator(control: AbstractControl): ValidationErrors | null {
    const [name, ...lastName] = (control.value as string).split(' ').filter((value) => value !== ' ');

    const onlyLetters = /^[\p{L} ,.'-]+$/u;
    const isOnlyLetters = onlyLetters.test(name) && lastName.every((name: string) => onlyLetters.test(name));

    return !isOnlyLetters || (!!name && (name.length < 2 || lastName.length <= 0)) ? { invalidName: true } : null;
  }
}
