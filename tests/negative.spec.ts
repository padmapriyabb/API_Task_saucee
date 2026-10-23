
import { test, expect, APIRequestContext } from '@playwright/test';
import { randomUUID } from 'node:crypto';

// ========================================
// REUSABLE FUNCTION: Generate Valid Token
// ========================================

async function getToken(
  request: APIRequestContext
): Promise<string> {

  const response = await request.post('/api-clients/', {
    data: {
      clientName: 'Negative Test Client',
      clientEmail: `qa${randomUUID()}@example.com`
    }
  });

  expect(response.status()).toBe(201);

  const body = await response.json();

  expect(body.accessToken).toBeTruthy();

  return body.accessToken as string;
}

// ========================================
// TEST CASE 1: POST Without Token
// ========================================

test('Negative - Create Order Without Token', async ({ request }) => {

  const response = await request.post('/orders', {
    data: {
      bookId: 1,
      customerName: 'QA Tester'
    }
  });

  expect(response.status()).toBe(401);

  console.log('Without Token Status:', response.status());

});

// ========================================
// TEST CASE 2: POST With Invalid Token
// ========================================

test('Negative - Create Order With Invalid Token', async ({ request }) => {

  const response = await request.post('/orders', {
    headers: {
      Authorization: 'Bearer invalid_token_123'
    },
    data: {
      bookId: 1,
      customerName: 'QA Tester'
    }
  });

  expect(response.status()).toBe(401);

  console.log('Invalid Token Status:', response.status());

});

// ========================================
// TEST CASE 3: GET Invalid Book ID
// ========================================

test('Negative - Get Invalid Book ID', async ({ request }) => {

  const response = await request.get('/books/999999');

  expect(response.status()).toBe(404);

  console.log('Invalid Book ID Status:', response.status());

});

// ========================================
// TEST CASE 4: Missing Customer Name
// ========================================

test('Negative - Missing Customer Name', async ({ request }) => {

  const token = await getToken(request);

  const response = await request.post('/orders', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      bookId: 1
    }
  });

  expect(response.status()).toBe(400);

  console.log('Missing Customer Name Status:', response.status());

});

// ========================================
// TEST CASE 5: Invalid Book ID in POST
// ========================================

test('Negative - Invalid Book ID in POST', async ({ request }) => {

  const token = await getToken(request);

  const response = await request.post('/orders', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      bookId: 999999,
      customerName: 'QA Tester'
    }
  });

  expect(response.status()).toBe(400);

  console.log('Invalid Book ID Status:', response.status());

});

// ========================================
// TEST CASE 6: PATCH Without Token
// ========================================

test('Negative - PATCH Without Token', async ({ request }) => {

  const response = await request.patch(
    '/orders/invalid-order-id',
    {
      data: {
        customerName: 'Updated Tester'
      }
    }
  );

  expect(response.status()).toBe(401);

  console.log('PATCH Without Token Status:', response.status());

});

// ========================================
// TEST CASE 7: DELETE Without Token
// ========================================

test('Negative - DELETE Without Token', async ({ request }) => {

  const response = await request.delete(
    '/orders/invalid-order-id'
  );

  expect(response.status()).toBe(401);

  console.log('DELETE Without Token Status:', response.status());

});
