import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'schedules' },
  {
    path: 'employees',
    title: 'Employees',
    loadComponent: () => import('./features/employees/employees-page').then((m) => m.EmployeesPage),
  },
  {
    path: 'employees/:id',
    title: 'Availability',
    loadComponent: () => import('./features/restrictions/restrictions-page').then((m) => m.RestrictionsPage),
  },
  {
    path: 'shifts',
    title: 'Shifts',
    loadComponent: () => import('./features/shifts/shifts-page').then((m) => m.ShiftsPage),
  },
  {
    path: 'generate',
    title: 'Generate schedule',
    loadComponent: () => import('./features/generate/generate-page').then((m) => m.GeneratePage),
  },
  {
    path: 'schedules',
    title: 'Schedules',
    loadComponent: () => import('./features/schedules/schedules-page').then((m) => m.SchedulesPage),
  },
  {
    path: 'schedules/:id',
    title: 'Schedule',
    loadComponent: () => import('./features/schedule-view/schedule-view-page').then((m) => m.ScheduleViewPage),
  },
  {
    path: 'schedules/:id/print',
    title: 'Print schedule',
    loadComponent: () => import('./features/schedule-print/schedule-print-page').then((m) => m.SchedulePrintPage),
  },
  {
    path: 'rules',
    title: 'Rules',
    loadComponent: () => import('./features/rules/rules-page').then((m) => m.RulesPage),
  },
  {
    path: 'schedules/:id/breaks',
    title: 'Breaks',
    loadComponent: () => import('./features/breaks/breaks-page').then((m) => m.BreaksPage),
  },
  {
    path: 'schedules/:id/breaks/print',
    title: 'Print breaks',
    loadComponent: () => import('./features/breaks/breaks-print-page').then((m) => m.BreaksPrintPage),
  },
  {
    path: 'import',
    title: 'Import from Teams Shifts',
    loadComponent: () => import('./features/import/import-page').then((m) => m.ImportPage),
  },
  {
    path: 'settings',
    title: 'Settings',
    loadComponent: () => import('./features/settings/settings-page').then((m) => m.SettingsPage),
  },
  { path: '**', redirectTo: 'schedules' },
];
