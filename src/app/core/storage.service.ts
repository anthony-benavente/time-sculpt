import { Injectable } from '@angular/core';

const PREFIX = 'scheduler.v1.';
export const EXPORT_VERSION = 1;

export const STORAGE_KEYS = ['employees', 'restrictions', 'shiftTemplates', 'schedules', 'settings', 'rules'] as const;
export type StorageKey = (typeof STORAGE_KEYS)[number];

export interface ExportBundle {
  app: 'scheduler';
  version: number;
  exportedAt: string;
  data: Partial<Record<StorageKey, unknown>>;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  read<T>(key: StorageKey, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  write<T>(key: StorageKey, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save', key, e);
    }
  }

  /** Export everything except the API key. */
  exportAll(): ExportBundle {
    const data: ExportBundle['data'] = {};
    for (const key of STORAGE_KEYS) {
      const value = this.read<unknown>(key, null);
      if (value == null) continue;
      if (key === 'settings') {
        const { anthropicApiKey: _omit, ...rest } = value as Record<string, unknown>;
        data[key] = rest;
      } else {
        data[key] = value;
      }
    }
    return { app: 'scheduler', version: EXPORT_VERSION, exportedAt: new Date().toISOString(), data };
  }

  /** Validate an import bundle and write it. Returns the keys imported. Caller should reload stores. */
  importAll(json: string): StorageKey[] {
    const bundle = JSON.parse(json) as ExportBundle;
    if (bundle?.app !== 'scheduler' || typeof bundle.version !== 'number' || !bundle.data) {
      throw new Error('This file is not a Scheduler export.');
    }
    if (bundle.version > EXPORT_VERSION) {
      throw new Error('This export was made by a newer version of the app.');
    }
    const imported: StorageKey[] = [];
    for (const key of STORAGE_KEYS) {
      const value = bundle.data[key];
      if (value === undefined) continue;
      if (key === 'settings') {
        // Keep the existing API key; it is never exported.
        const current = this.read<Record<string, unknown>>('settings', {});
        this.write(key, { ...(value as object), anthropicApiKey: current['anthropicApiKey'] ?? '' });
      } else if (key === 'rules') {
        if (!value || typeof value !== 'object') throw new Error('Invalid data for "rules".');
        this.write(key, value);
      } else {
        if (!Array.isArray(value)) throw new Error(`Invalid data for "${key}".`);
        this.write(key, value);
      }
      imported.push(key);
    }
    return imported;
  }
}
