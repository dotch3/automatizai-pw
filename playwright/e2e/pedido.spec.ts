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
 
  // Act
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible()
  await expect(page.getByTestId('search-order-id')).toBeVisible()
  await page.getByTestId('search-order-id').fill('VLO-Z7BH0H')
  await page.getByTestId('search-order-button').click()
  
  // Assert
  await expect(page.getByTestId('order-result-id')).toBeVisible()
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-Z7BH0H')

  await expect(page.getByTestId('order-result-status')).toBeVisible()
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')
})