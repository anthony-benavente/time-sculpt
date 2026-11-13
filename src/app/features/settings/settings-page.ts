import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '../../core/storage.service';
import { EmployeeStore, ScheduleStore, SettingsStore, ShiftTemplateStore } from '../../core/stores';
import { AI_MODELS } from '../../scheduling/ai-scheduler.service';
import { confirm } from '../../shared/confirm-dialog';
import { loadSampleData } from './sample-data';

@Component({
  selector: 'app-settings-page',
  imports: [FormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <div class="page" style="max-width: 820px">
      <div class="page-header"><h1>Settings</h1></div>

      <div class="card">
        <h2>General</h2>
        <div class="form-grid" style="grid-template-columns: 2fr 1fr">
          <mat-form-field>
            <mat-label>Business name (printed on schedules)</mat-label>
            <input matInput [ngModel]="s().businessName" (ngModelChange)="store.update({ businessName: $event })" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Week starts on</mat-label>
            <mat-select [ngModel]="s().weekStartsOn" (ngModelChange)="store.update({ weekStartsOn: $event })">
              <mat-option [value]="1">Monday</mat-option>
              <mat-option [value]="0">Sunday</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <div class="card">
        <h2><mat-icon inline>auto_awesome</mat-icon> Claude (AI scheduling)</h2>
        <p class="small muted" style="margin-top: 0">
          Optional. With an API key from
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>
          you can ask Claude to build schedules. Usage is billed to your Anthropic account.
        </p>
        <div class="row" style="align-items: flex-start">
          <mat-form-field style="flex: 1; min-width: 260px">
            <mat-label>Anthropic API key</mat-label>
            <input
              matInput
              [type]="showKey() ? 'text' : 'password'"
              autocomplete="off"
              [ngModel]="s().anthropicApiKey"
              (ngModelChange)="store.update({ anthropicApiKey: $event.trim() })"
              placeholder="sk-ant-..."
            />
            <button mat-icon-button matSuffix (click)="showKey.set(!showKey())" type="button">
              <mat-icon>{{ showKey() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>
          <mat-form-field style="width: 300px">
            <mat-label>Model</mat-label>
            <mat-select [ngModel]="s().aiModel" (ngModelChange)="store.update({ aiModel: $event })">
              @for (m of models; track m.id) {
                <mat-option [value]="m.id">{{ m.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
        <p class="small" style="color: #b45309">
          <mat-icon inline>shield</mat-icon> The key is stored only in this browser (localStorage) and sent only to
          api.anthropic.com. Don't use this on a shared computer. The key is never included in exports.
        </p>
        @if (s().anthropicApiKey) {
          <button mat-button (click)="store.update({ anthropicApiKey: '' })"><mat-icon>key_off</mat-icon>Remove key</button>
        }
      </div>

      <div class="card">
        <h2>Backup &amp; restore</h2>
        <p class="small muted" style="margin-top: 0">
          Your data lives in this browser. Export a backup regularly, or to move to another computer.
        </p>
        <div class="row">
          <button mat-flat-button (click)="exportData()"><mat-icon>download</mat-icon>Export backup</button>
          <button mat-stroked-button (click)="fileInput.click()"><mat-icon>upload</mat-icon>Import backup</button>
          <input #fileInput type="file" accept="application/json,.json" hidden (change)="importData($event)" />
        </div>
      </div>

      <div class="card">
        <h2>Sample data</h2>
        <p class="small muted" style="margin-top: 0">Load a demo team and shifts to try things out.</p>
        <button mat-stroked-button (click)="loadSample()"><mat-icon>science</mat-icon>Load sample data</button>
      </div>
    </div>
  `,
})
export class SettingsPage {
  protected readonly store = inject(SettingsStore);
  protected readonly s = this.store.settings;
  private readonly storage = inject(StorageService);
  private readonly employees = inject(EmployeeStore);
  private readonly templates = inject(ShiftTemplateStore);
  private readonly schedules = inject(ScheduleStore);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  protected readonly models = AI_MODELS;
  protected readonly showKey = signal(false);

  exportData(): void {
    const bundle = this.storage.exportAll();
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scheduler-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async importData(ev: Event): Promise<void> {
    const inputEl = ev.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (!file) return;
    const ok = await confirm(this.dialog, {
      title: 'Import backup?',
      message: 'This replaces your current employees, shifts and schedules with the ones in the file.',
      confirmText: 'Import',
      danger: true,
    });
    if (!ok) return;
    try {
      const imported = this.storage.importAll(await file.text());
      this.reloadAll();
      this.snack.open(`Imported ${imported.join(', ')}.`, undefined, { duration: 3000 });
    } catch (e) {
      this.snack.open(e instanceof Error ? e.message : 'Import failed.', 'OK', { duration: 6000 });
    }
  }

  async loadSample(): Promise<void> {
    const hasData = this.employees.employees().length > 0 || this.templates.templates().length > 0;
    if (hasData) {
      const ok = await confirm(this.dialog, {
        title: 'Replace current data?',
        message: 'Loading sample data replaces your employees and shifts. Saved schedules are kept.',
        confirmText: 'Load sample',
        danger: true,
      });
      if (!ok) return;
    }
    loadSampleData(this.storage);
    this.reloadAll();
    this.snack.open('Sample data loaded.', undefined, { duration: 2500 });
  }

  private reloadAll(): void {
    this.employees.reload();
    this.templates.reload();
    this.schedules.reload();
    this.store.reload();
  }
}
