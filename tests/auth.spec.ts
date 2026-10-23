
import { test, expect } from '@playwright/test';

test('POST - Generate Authentication Token', async ({ request }) => {

  
  const email = `qa${Date.now()}@example.com`;

  
  const response = await request.post('/api-clients/', {
    data: {
      clientName: 'QA Automation Tester',
      clientEmail: email
    }
  });

  
  expect(response.status()).toBe(201);

  
  const responseBody = await response.json();

  
  console.log('Authentication token generated successfully');

  
  expect(responseBody.accessToken).toBeTruthy();

});
