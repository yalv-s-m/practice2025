import type { Lot } from '@/types/lot';

const BASE = '/api/lots';

class LotService {
  static async getAll(): Promise<Lot[]> {
    const r = await fetch(BASE);
    if (!r.ok) throw new Error('Failed to fetch lots');
    return r.json();
  }

  static async get(id: number): Promise<Lot> {
    const r = await fetch(`${BASE}/${id}`);
    if (!r.ok) throw new Error('Lot not found');
    return r.json();
  }

  static async create(payload: Omit<Lot, 'id'>): Promise<void> {
    const r = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('Create failed');
  }

  static async update(id: number, payload: Lot): Promise<void> {
    const r = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('Update failed');
  }

  static async remove(id: number): Promise<void> {
    const r = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error('Delete failed');
  }
}

export default LotService;
