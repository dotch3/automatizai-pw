import { test, expect } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'

import { OrderLookupPage, OrderStatus } from '../support/pages/OrderLookupPage'
/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {
	test.beforeEach(async ({ page }) => {
		// Arrange
		await page.goto('http://localhost:5173/')
		await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

		await page.getByRole('link', { name: 'Consultar Pedido' }).click()
		await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
	})

	test('deve consultar um pedido aprovado', async ({ page }) => {
		// Test Data
		const order = {
			number: 'VLO-Z7BH0H',
			status: 'APROVADO' as OrderStatus,
			color: 'Midnight Black',
			wheels: 'aero Wheels',
			customer: {
				name: 'jorgito mercado',
				email: 'test@dev.com',
			},
			payment: 'À Vista',
		}

		// Act
		const orderLookupPage = new OrderLookupPage(page)
		await orderLookupPage.searchOrder(order.number)

		// Assert
		await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
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

		await orderLookupPage.expectStatusBadge(order.status)
	})

	test('deve consultar um pedido reprovado', async ({ page }) => {
		// Test Data
		const order = {
			number: 'VLO-ZI4ETT',
			status: 'REPROVADO' as OrderStatus,
			color: 'Glacier Blue',
			wheels: 'aero Wheels',
			customer: {
				name: 'Jorgito Mercado',
				email: 'test-financiamento-reprovado@dev.com',
			},
			payment: 'Financiamento 12x',
		}

		// Act
		const orderLookupPage = new OrderLookupPage(page)
		await orderLookupPage.searchOrder(order.number)

		// Assert
		await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
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

		await orderLookupPage.expectStatusBadge(order.status)
	})

	test('deve consultar um pedido em analise', async ({ page }) => {
		// Test Data
		const order = {
			number: 'VLO-MB874B',
			status: 'EM_ANALISE' as OrderStatus,
			color: 'Glacier Blue',
			wheels: 'aero Wheels',
			customer: {
				name: 'Jorgito Mercado',
				email: 'test-financiamento-am-analise@dev.com',
			},
			payment: 'Financiamento 12x',
		}

		// Act
		const orderLookupPage = new OrderLookupPage(page)
		await orderLookupPage.searchOrder(order.number)

		// Assert
		await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
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

		await orderLookupPage.expectStatusBadge(order.status)
	})

	test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {
		const order = generateOrderCode()

		const orderLookupPage = new OrderLookupPage(page)
		await orderLookupPage.searchOrder(order)

		await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)
	})
})
