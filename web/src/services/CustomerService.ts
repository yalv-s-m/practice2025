import type { Customer } from '@/types/customer';

const BASE = '/api/customers';

class CustomerService {
  /* GET /api/customers */
  static async getAll(): Promise<Customer[]> {
    const r = await fetch(BASE);
    if (!r.ok) throw new Error('Failed to fetch customers');
    return r.json();
  }

  /* GET /api/customers/:code */
  static async get(code: string): Promise<Customer> {
    const r = await fetch(`${BASE}/${code}`);
    if (!r.ok) throw new Error('Customer not found');
    return r.json();
  }

  /* POST /api/customers */
  static async create(payload: Customer): Promise<void> {
    const r = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('Create failed');
  }

  /* PUT /api/customers/:code */
  static async update(code: string, payload: Customer): Promise<void> {
    const r = await fetch(`${BASE}/${code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('Update failed');
  }

  /* DELETE /api/customers/:code */
  static async remove(code: string): Promise<void> {
    const r = await fetch(`${BASE}/${code}`, { method: 'DELETE' });
    if (!r.ok) throw new Error('Delete failed');
  }
}

export default CustomerService;
