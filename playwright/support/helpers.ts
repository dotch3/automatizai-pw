
/**
 * Gera um código de pedido aleatório no formato 'AAA-XXXXXXXX'
 * @param prefix - O prefixo de 3 caracteres (padrão: 'VLO')
 * @returns Um código formatado
 */
export const generateOrderCode=(prefix: string = 'VLO'): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return `${prefix.toUpperCase()}-${result}`;
}
