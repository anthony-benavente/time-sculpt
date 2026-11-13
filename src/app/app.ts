import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { filter, map } from 'rxjs';
import { SettingsStore } from './core/stores';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  protected readonly settings = inject(SettingsStore).settings;

  /** Hide the app chrome on the print page. */
  protected readonly printMode = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects.endsWith('/print') || (e as NavigationEnd).urlAfterRedirects.includes('/print?')),
    ),
    { initialValue: false },
  );

  protected readonly links = [
    { path: '/schedules', label: 'Schedules', icon: 'calendar_month' },
    { path: '/generate', label: 'Generate', icon: 'auto_awesome' },
    { path: '/employees', label: 'Employees', icon: 'group' },
    { path: '/shifts', label: 'Shifts', icon: 'schedule' },
    { path: '/rules', label: 'Rules', icon: 'rule' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];
}
