import { expect, Page } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

const STATUS_BADGE: Record<OrderStatus, { bg: RegExp; text: RegExp; icon: RegExp }> = {
	APROVADO: { bg: /bg-green-100/, text: /text-green-700/, icon: /lucide-circle-check-big/ },
	REPROVADO: { bg: /bg-red-100/, text: /text-red-700/, icon: /lucide-circle-x/ },
	EM_ANALISE: { bg: /bg-amber-100/, text: /text-amber-700/, icon: /lucide-clock/ },
}

export class OrderLookupPage {
	constructor(private page: Page) {}

	async searchOrder(code: string) {
		await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code)
		await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
	}

	async expectStatusBadge(status: OrderStatus) {
		const { bg, text, icon } = STATUS_BADGE[status]
		const statusBadge = this.page.getByRole('status').filter({ hasText: status })

		await expect(statusBadge).toHaveClass(bg)
		await expect(statusBadge).toHaveClass(text)

		const statusIcon = statusBadge.locator('svg')
		await expect(statusIcon).toHaveClass(icon)
	}
}
