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

		await page.getByRole('link', { name: 'Consultar Pedido' }).click()
		await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible()
	})

	test('Deve exhibir os dados do pedido aprovado utilizando snapshot', async ({ page }) => {
		// test Data
		// const orderId = 'VLO-Z7BH0H'

		const order = {
			id: 'VLO-Z7BH0H',
			status: 'APROVADO',
			color: 'Midnight Black',
			wheels: 'aero Wheels',
			customer: {
				name: 'jorgito mercado',
				email: 'test@dev.com',
			},
			payment: 'À Vista',
		}

		//act
		await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.id, { timeout: 10_000 })
		await page.getByRole('button', { name: 'Buscar Pedido' }).click()

		await expect(page.getByTestId(`order-result-${order.id}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.id}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `)

		const statusBadge = page.getByRole('status').filter({ hasText: 'APROVADO' })

		await expect(statusBadge).toHaveClass(/bg-green-100/)
		await expect(statusBadge).toHaveClass(/text-green-700/)

		const statusIcon = statusBadge.locator('svg')
		await expect(statusIcon).toHaveClass(/lucide-circle-check/)
	})

	test('Deve exhibir os dados do pedido reprovado utilizando snapshot', async ({ page }) => {
		// test Data
		// const orderId = 'VLO-ZI4ETT'
		const order = {
			id: 'VLO-ZI4ETT',
			status: 'REPROVADO',
			color: 'Glacier Blue',
			wheels: 'aero Wheels',
			customer: {
				name: 'Jorgito Mercado',
				email: 'test-financiamento-reprovado@dev.com',
			},
			payment: 'Financiamento 12x',
		}

		//act
		await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.id, { timeout: 10_000 })
		await page.getByRole('button', { name: 'Buscar Pedido' }).click()

		await expect(page.getByTestId(`order-result-${order.id}`)).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order.id}
        - status:
          - img
          - text: ${order.status}
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: ${order.color}
        - paragraph: Interior
        - paragraph: cream
        - paragraph: Rodas
        - paragraph: ${order.wheels}
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: ${order.customer.name}
        - paragraph: Email
        - paragraph: ${order.customer.email}
        - paragraph: Loja de Retirada
        - paragraph
        - paragraph: Data do Pedido
        - paragraph: /\\d+\\/\\d+\\/\\d+/
        - heading "Pagamento" [level=4]
        - paragraph: ${order.payment}
        - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
        `)

		const statusBadge = page.getByRole('status').filter({ hasText: 'REPROVADO' })

		await expect(statusBadge).toHaveClass(/bg-red-100/)
		await expect(statusBadge).toHaveClass(/text-red-700/)

		const statusIcon = statusBadge.locator('svg')
		await expect(statusIcon).toHaveClass(/lucide-circle-x/)
	})

	test('Deve exhibir os dados do pedido em análise utilizando snapshot', async ({ page }) => {
		// test Data
		const order = {
			id: 'VLO-MB874B',
			status: 'EM_ANALISE',
			color: 'Glacier Blue',
			wheels: 'aero Wheels',
			customer: {
				name: 'Jorgito Mercado',
				email: 'test-financiamento-am-analise@dev.com',
			},
			payment: 'Financiamento 12x',
		}

		//act
		await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.id, { timeout: 10_000 })
		await page.getByRole('button', { name: 'Buscar Pedido' }).click()

		await expect(page.getByTestId(`order-result-${order.id}`)).toMatchAriaSnapshot(`
        - img
        - paragraph: Pedido
        - paragraph: ${order.id}
        - status:
          - img
          - text: ${order.status}
        - img "Velô Sprint"
        - paragraph: Modelo
        - paragraph: Velô Sprint
        - paragraph: Cor
        - paragraph: ${order.color}
        - paragraph: Interior
        - paragraph: cream
        - paragraph: Rodas
        - paragraph: ${order.wheels}
        - heading "Dados do Cliente" [level=4]
        - paragraph: Nome
        - paragraph: ${order.customer.name}
        - paragraph: Email
        - paragraph: ${order.customer.email}
        - paragraph: Loja de Retirada
        - paragraph
        - paragraph: Data do Pedido
        - paragraph: /\\d+\\/\\d+\\/\\d+/
        - heading "Pagamento" [level=4]
        - paragraph: ${order.payment}
        - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `)

		const statusBadge = page.getByRole('status').filter({ hasText: 'EM_ANALISE' })
		await expect(statusBadge).toHaveClass(/bg-amber-100/)
		await expect(statusBadge).toHaveClass(/text-amber-700/)
		await expect(statusBadge.locator('svg')).toHaveClass(/lucide-clock/)
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

		// de forma generica procurando em td a pagina
		const message3 = page.locator('p', { hasText: 'Verifique o número do pedido e tente novamente' })
		await expect(message3).toBeVisible()

		//assert utilizando o Snapshot
		await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `)

		const divErrorMessage = page.getByRole('heading', { name: 'Pedido não encontrado', level: 3 }).locator('..')
		await expect(divErrorMessage).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)
	})
})
