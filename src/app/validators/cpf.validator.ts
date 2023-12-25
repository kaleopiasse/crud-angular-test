import { AbstractControl, ValidationErrors } from '@angular/forms'
import { StringUtils } from '../utils/string.utils'


export class CpfValidator {
  static validator(control: AbstractControl): ValidationErrors | null {
    const value = Array.isArray(control.value) ? control.value[0] : control.value

    const cpfError: ValidationErrors = { cpf: true }
    const cpf = value.replace(/\.|\-/g, '')

    // Teste #1: CPF tem 11 dígitos?
    if (cpf.length < 11) {
      return cpfError
    }

    // Teste #2: Ao colocarmos as pontuações, o CPF
    // bate com o formato padrão de CPF?
    const regexCPF = /\d{3}\.\d{3}\.\d{3}-\d{2}/
    if (!regexCPF.test(StringUtils.formatCPF(cpf))) {
      return cpfError
    }

    // Teste #3: A numeração do CPF é válida?
    const validCPF = CpfValidator.validateCPF(cpf)

    return validCPF ? null : cpfError
  }

  static validateCPF(strCPF: string) {
    let sum = 0
    let rest

    if (CpfValidator.isSequence(strCPF)) return false

    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(strCPF.substring(i - 1, i), 10) * (11 - i)
      rest = (sum * 10) % 11
    }

    if (rest === 10 || rest === 11) {
      rest = 0
    }

    if (rest !== parseInt(strCPF.substring(9, 10), 10)) {
      return false
    }

    sum = 0

    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(strCPF.substring(i - 1, i), 10) * (12 - i)
      rest = (sum * 10) % 11
    }

    if (rest === 10 || rest === 11) {
      rest = 0
    }

    return rest !== parseInt(strCPF.substring(10, 11), 10) ? false : true
  }

  static isSequence(strCPF: string) {
    const sequence = strCPF[0].repeat(strCPF.length)
    return strCPF === sequence
  }
}
