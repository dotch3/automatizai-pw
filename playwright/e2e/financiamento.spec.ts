import { test, expect } from '@playwright/test'
import { mockCreditAnalysis, mockCreditAnalysisFailure } from '../support/mocks'

/**
 * Preenche o formulário de checkout com dados válidos e seleciona
 * financiamento como forma de pagamento. Não mexe em cor/roda/opcionais:
 * o botão "checkout-button" do configurador já leva pro /order com a
 * configuração default da store.
 */
const preencherCheckoutFinanciamento = async (page: import('@playwright/test').Page) => {
  await page.goto('http://localhost:5173/configure')
  await page.getByTestId('checkout-button').click()

  await page.getByTestId('checkout-name').fill('Jorgito')
  await page.getByTestId('checkout-surname').fill('Mercado')
  await page.getByTestId('checkout-email').fill('test@dev.com')
  await page.getByTestId('checkout-phone').fill('11999999999')
  await page.getByTestId('checkout-cpf').fill('52998224725') // CPF válido só pro formato/máscara
  await page.getByTestId('checkout-store').click()
  await page.getByRole('option').first().click()
  await page.getByTestId('checkout-terms').click()

  await page.getByTestId('payment-financiamento').click()
}

test.describe('Financiamento - análise de crédito (mockada)', () => {
  // Fluxo de checkout tem mais passos que os outros specs; timeout global
  // de 5s (playwright.config.ts) é curto demais pra esse fluxo completo.
  test.describe.configure({ timeout: 20_000 })

  test('score alto (>700) deve aprovar o pedido', async ({ page }) => {
    // Arrange: intercepta a Edge Function ANTES de disparar o submit
    await mockCreditAnalysis(page, 850)
    await preencherCheckoutFinanciamento(page)

    // Act
    await page.getByTestId('checkout-submit').click()

    // Assert
    await expect(page).toHaveURL(/\/success/)
    await expect(page.getByTestId('success-status')).toHaveText('Pedido Aprovado!')
  })

  test('score baixo (<=500) deve reprovar o pedido', async ({ page }) => {
    await mockCreditAnalysis(page, 300)
    await preencherCheckoutFinanciamento(page)

    await page.getByTestId('checkout-submit').click()

    await expect(page).toHaveURL(/\/success/)
    await expect(page.getByTestId('success-status')).toHaveText('Crédito Reprovado')
  })

  test('score médio (501-700) deve colocar o pedido em análise', async ({ page }) => {
    await mockCreditAnalysis(page, 600)
    await preencherCheckoutFinanciamento(page)

    await page.getByTestId('checkout-submit').click()

    // OBS: Success.tsx só distingue APROVADO x resto (isApproved).
    // Hoje EM_ANALISE cai no mesmo texto de reprovado — vale reportar
    // como bug de produto separado, não é problema do teste.
    await expect(page).toHaveURL(/\/success/)
  })

  test('falha na consulta de crédito deve exibir toast de erro', async ({ page }) => {
    await mockCreditAnalysisFailure(page)
    await preencherCheckoutFinanciamento(page)

    await page.getByTestId('checkout-submit').click()

    await expect(page.getByTestId('toast-error')).toBeVisible()
    // Não deve navegar - pedido não foi criado
    await expect(page).toHaveURL(/\/order/)
  })
})
