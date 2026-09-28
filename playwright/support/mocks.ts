import type { Page } from '@playwright/test'

/**
 * Intercepta a chamada de rede que o front faz para a Edge Function
 * 'credit-analysis' (via supabase.functions.invoke) e responde com um
 * score fake, sem bater na function real nem no Serasa.
 *
 * Precisa ser registrado ANTES da ação que dispara a chamada
 * (ex: antes do click em "checkout-submit").
 */
export const mockCreditAnalysis = async (page: Page, score: number) => {
  await page.route('**/functions/v1/credit-analysis', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'Done', score }),
    })
  })
}

/** Simula falha da Edge Function (ex: Serasa fora do ar / auth inválida) */
export const mockCreditAnalysisFailure = async (page: Page) => {
  await page.route('**/functions/v1/credit-analysis', async (route) => {
    await route.fulfill({
      status: 502,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Erro na consulta de crédito' }),
    })
  })
}
