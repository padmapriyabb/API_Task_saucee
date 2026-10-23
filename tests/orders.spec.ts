import { test, expect, APIRequestContext } from '@playwright/test';
import { randomUUID } from 'node:crypto';


async function generateToken(request: APIRequestContext): Promise<string> {

  const email = `qa${randomUUID()}@example.com`;

  const authResponse = await request.post('/api-clients/', {
    data: {
      clientName: 'QA Automation Tester',
      clientEmail: email
    }
  });

  expect(authResponse.status()).toBe(201);

  const authBody = await authResponse.json();
  const token: string = authBody.accessToken;

  expect(token).toBeTruthy();

  return token;
}


async function getAvailableBook(request: APIRequestContext): Promise<number> {

  const booksResponse = await request.get('/books');

  expect(booksResponse.status()).toBe(200);

  const books = await booksResponse.json();

  const availableBook = books.find(
    (book: { id: number; available: boolean }) =>
      book.available === true
  );

  expect(availableBook).toBeDefined();

  return availableBook.id;
}


async function createBookOrder(
  request: APIRequestContext,
  token: string,
  bookId: number,
  customerName: string
): Promise<string> {

  const createResponse = await request.post('/orders', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: {
      bookId,
      customerName
    }
  });

  expect(createResponse.status()).toBe(201);

  const createBody = await createResponse.json();

  expect(createBody.created).toBe(true);
  expect(createBody.orderId).toBeTruthy();

  return createBody.orderId;
}

test('POST - Create Book Order', async ({ request }) => {


  const token = await generateToken(request);

  
  const bookId = await getAvailableBook(request);

  
  const orderId = await createBookOrder(
    request,
    token,
    bookId,
    'Syed QA Tester'
  );

 
  expect(orderId).toBeTruthy();

  console.log('POST API - Order Created Successfully');
  console.log('Created Order ID:', orderId);

});

test('GET - Verify Order By ID', async ({ request }) => {

  
  const token = await generateToken(request);

 
  const bookId = await getAvailableBook(request);

 
  const orderId = await createBookOrder(
    request,
    token,
    bookId,
    'Syed QA Tester'
  );

  
  const getResponse = await request.get(
    `/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

 
  expect(getResponse.status()).toBe(200);

  const orderDetails = await getResponse.json();

  console.log('GET Order Response:', orderDetails);

  
  expect(orderDetails.id).toBe(orderId);
  expect(orderDetails.bookId).toBe(bookId);
  expect(orderDetails.customerName).toBe('Syed QA Tester');
  expect(orderDetails.quantity).toBe(1);

});



test('PATCH - Update Book Order', async ({ request }) => {

 
  const token = await generateToken(request);

  
  const bookId = await getAvailableBook(request);

 
  const orderId = await createBookOrder(
    request,
    token,
    bookId,
    'Syed QA Tester'
  );

  console.log('Created Order ID:', orderId);

 
  const patchResponse = await request.patch(
    `/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        customerName: 'Updated QA Tester'
      }
    }
  );

 
  expect(patchResponse.status()).toBe(204);

  console.log('PATCH API - Order Updated Successfully');

  
  const getResponse = await request.get(
    `/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  expect(getResponse.status()).toBe(200);

  const updatedOrder = await getResponse.json();

  console.log('Updated Order Response:', updatedOrder);

  // Step 7: Validate updated details
  expect(updatedOrder.id).toBe(orderId);
  expect(updatedOrder.bookId).toBe(bookId);
  expect(updatedOrder.customerName).toBe('Updated QA Tester');
  expect(updatedOrder.quantity).toBe(1);

});


test('DELETE - Delete Book Order', async ({ request }) => {

  
  const token = await generateToken(request);

  
  const bookId = await getAvailableBook(request);

 
  const orderId = await createBookOrder(
    request,
    token,
    bookId,
    'Syed QA Tester'
  );

  console.log('Created Order ID:', orderId);

  
  const deleteResponse = await request.delete(
    `/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

 
  expect(deleteResponse.status()).toBe(204);

  console.log('DELETE API - Order Deleted Successfully');

  
  const getResponse = await request.get(
    `/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  
  expect(getResponse.status()).toBe(404);

  console.log('GET Deleted Order Status:', getResponse.status());
  console.log('DELETE Verification Successful');

});
