
import { test, expect } from '@playwright/test';

test('GET - Verify All Books', async ({ request }) => {

  
  const response = await request.get('/books');

  
  expect(response.status()).toBe(200);

  
  const responseBody = await response.json();

 
  console.log('Books Response:', responseBody);

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

});

