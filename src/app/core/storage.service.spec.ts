import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService export/import', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips data and never exports the API key', () => {
    const svc = TestBed.inject(StorageService);
    svc.write('employees', [{ id: '1', name: 'A' }]);
    svc.write('settings', { businessName: 'Shop', anthropicApiKey: 'sk-secret' });
    const json = JSON.stringify(svc.exportAll());
    expect(json).not.toContain('sk-secret');

    localStorage.clear();
    svc.write('settings', { anthropicApiKey: 'sk-mine' });
    const imported = svc.importAll(json);
    expect(imported).toContain('employees');
    expect(svc.read('employees', [])).toEqual([{ id: '1', name: 'A' }]);
    expect(svc.read<Record<string, string>>('settings', {})).toEqual({ businessName: 'Shop', anthropicApiKey: 'sk-mine' });
  });

  it('rejects files that are not exports', () => {
    const svc = TestBed.inject(StorageService);
    expect(() => svc.importAll('{"hello":1}')).toThrow(/not a Scheduler export/);
  });
});
