import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helpers'
/** AAA - Arrange, Act, Assert
 // Arrange - Preparar o teste
 // Act - Executar o teste
 // Assert - Verificar o resultado  */

test.describe('Consulta de Pedido', () => {
  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Consultar Pedido' })).toBeVisible()
    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    // Act
    await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible()
  })

  test('Deve consultar um pedido aprovado', async ({ page }) => {
    const orderId = 'VLO-Z7BH0H'
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderId, { timeout: 20_000 })
    await expect(page.getByRole('button', { name: 'Buscar Pedido' })).toBeVisible()
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    // Assert
    const containerPedido = page
      .getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator('..') //sobe ao parent

    await expect(containerPedido).toContainText(orderId, { timeout: 10_000 })

    await expect(page.getByText('APROVADO')).toBeVisible()
  })

  test('Deve exhibir mensagem de pedido não encontrado', async ({ page }) => {
    const randomOrder = generateOrderCode()
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(randomOrder, { timeout: 10_000 })
    await expect(page.getByRole('button', { name: 'Buscar Pedido' })).toBeVisible()
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    // assert title
    const title = page.getByRole('heading', { name: 'Pedido não encontrado', level: 3 })
    await expect(title).toContainText('Pedido não encontrado')

    // assert message no paragrafo abaixo do title utilizando parent e o 'p' dentro do parent
    const message = title.locator('..').locator('p').first()
    await expect(message).toContainText('Verifique o número do pedido e tente novamente')

    // assert utilizando o parent e o texto dentro do parent (isolando o getByText ao parent do title)
    const message2 = title.locator('..').getByText('Verifique o número do pedido e tente novamente')
    await expect(message2).toContainText('Verifique o número do pedido e tente novamente')

    //assert utilizando o Snapshot

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
  - img
  - heading "Pedido não encontrado" [level=3]
  - paragraph: Verifique o número do pedido e tente novamente
  `)
  })

  test('Deve exhibir os dados do pedido utilizando snapshot', async ({ page }) => {
    const orderId = 'VLO-Z7BH0H'
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderId, { timeout: 10_000 })
    await expect(page.getByRole('button', { name: 'Buscar Pedido' })).toBeVisible()
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    await expect(page.getByTestId(`order-result-${orderId}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${orderId}
    - img
    - text: APROVADO
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: Midnight Black
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: aero Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: jorgito mercado
    - paragraph: Email
    - paragraph: test@dev.com
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: À Vista
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);
  })
})
