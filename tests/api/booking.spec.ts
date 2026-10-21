import { test, expect } from '@playwright/test';

// Public demo credentials documented by Restful-Booker for practice.
const AUTH = { username: 'admin', password: 'password123' };

const newBooking = {
  firstname: 'Steven',
  lastname: 'Brito',
  totalprice: 120,
  depositpaid: true,
  bookingdates: { checkin: '2026-11-01', checkout: '2026-11-05' },
  additionalneeds: 'Breakfast',
};

test.describe('Booking API', () => {
  test('GET /booking returns a list of booking ids', async ({ request }) => {
    const res = await request.get('/booking');
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('bookingid');
  });

  test('POST /booking creates a booking that can be read back', async ({ request }) => {
    const created = await request.post('/booking', { data: newBooking });
    expect(created.status()).toBe(200);

    const { bookingid, booking } = await created.json();
    expect(bookingid).toBeGreaterThan(0);
    expect(booking).toMatchObject(newBooking);

    const fetched = await request.get(`/booking/${bookingid}`);
    expect(fetched.status()).toBe(200);
    expect(await fetched.json()).toMatchObject(newBooking);
  });

  test('authenticated user can update and delete a booking', async ({ request }) => {
    // 1. Get an auth token
    const auth = await request.post('/auth', { data: AUTH });
    expect(auth.status()).toBe(200);
    const { token } = await auth.json();
    expect(token).toBeTruthy();
    const headers = { Cookie: `token=${token}` };

    // 2. Create a booking to work with
    const created = await request.post('/booking', { data: newBooking });
    const { bookingid } = await created.json();

    // 3. Update it
    const updatedData = { ...newBooking, firstname: 'Ricardo', totalprice: 150 };
    const updated = await request.put(`/booking/${bookingid}`, { data: updatedData, headers });
    expect(updated.status()).toBe(200);
    expect(await updated.json()).toMatchObject(updatedData);

    // 4. Delete it
    const deleted = await request.delete(`/booking/${bookingid}`, { headers });
    expect(deleted.status()).toBe(201);

    // 5. Confirm it no longer exists
    const afterDelete = await request.get(`/booking/${bookingid}`);
    expect(afterDelete.status()).toBe(404);
  });

  test('updating a booking without a token is rejected', async ({ request }) => {
    const created = await request.post('/booking', { data: newBooking });
    const { bookingid } = await created.json();

    const res = await request.put(`/booking/${bookingid}`, { data: newBooking });
    expect(res.status()).toBe(403);
  });
});
