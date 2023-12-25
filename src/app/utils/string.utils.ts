export class StringUtils {
  static formatCPF(cpf: string): string {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`
  }
}

export const MsgsInputValidation = {
  required: 'A campos obrigatórios que precisam ser preenchidos',
  cpf: 'Insira um CPF válido',
  invalidName: 'Insira um nome e sobrenome válidos',
  email: 'Insira um email válido'
}
