import { test, expect } from '@playwright/test'

// AAA - Arrange, Act, Assert
// Arrange - Preparar o teste
// Act - Executar o teste
// Assert - Verificar o resultado

test('Procurar um pedido existente', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Consultar Pedido' })).toBeVisible()
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
 
  // Act
  await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible()
  await expect(page.getByLabel('Número do Pedido')).toBeVisible()
  
  await page.getByLabel('Número do Pedido').fill('VLO-Z7BH0H')
  await expect(page.getByRole('button', { name: 'Buscar Pedido' })).toBeVisible()
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

  // Assert
  await expect(page.getByText('VLO-Z7BH0H')).toBeVisible({ timeout: 10_000 })
  await expect(page.getByText('APROVADO')).toBeVisible()
})