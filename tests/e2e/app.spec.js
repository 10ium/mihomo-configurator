import { expect, test } from '@playwright/test';

test('builds and previews a mihomo config from the browser UI', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Mihomo Configurator' })).toBeVisible();
  await page.locator('#lang-switch').selectOption('en');
  await expect(page.locator('#servers-title')).toHaveText('Add Servers');

  await page.locator('#btn-next').click();
  await page.locator('#proxy-urls').fill(
    'vless://11111111-1111-4111-8111-111111111111@edge.example.com:443?type=ws&security=tls&sni=sni.example.com&path=%2Fws&host=front.example.com#E2E%20VLESS'
  );
  await page.locator('#links-add-btn').click();
  await expect(page.locator('#proxy-tbody')).toContainText('E2E VLESS');

  await page.locator('#btn-next').click();
  await page.locator('#rule-payload').fill('example.org');
  await page.locator('#rule-add-btn').click();
  await expect(page.locator('#rules-list')).toContainText('DOMAIN-SUFFIX,example.org');

  await page.locator('#btn-next').click();
  const preview = page.locator('#config-preview');
  await expect(preview).toContainText('mode: rule');
  await expect(preview).toContainText('dns:');
  await expect(preview).toContainText('proxies:');
  await expect(preview).toContainText('name: E2E VLESS');
  await expect(preview).toContainText('DOMAIN-SUFFIX,example.org,Proxy');
  await expect(preview).toContainText('MATCH,DIRECT');
});
