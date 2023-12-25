export class StringUtils {
  static formatCPF(cpf: string): string {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`
  }
}

export const MsgsInputValidation = {
  cpf: 'Insira um CPF válido',
  email: 'Insira um email válido',
  invalidDateBirth: 'Cliente deve possuir idade entre 18 e 60 anos',
  invalidName: 'Insira um nome e sobrenome válidos',
  required: 'A campos obrigatórios que precisam ser preenchidos',
}
