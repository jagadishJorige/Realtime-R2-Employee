import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'employees' },
    { path: 'employees', loadComponent: ()=> import('./components/employees/employees.component').then(
        c => c.EmployeesComponent
    )},
    { path: 'employee/create', loadComponent: ()=> import('./components/employee-add-or-edit/employee-add-or-edit.component').then(
        c => c.EmployeeAddOrEditComponent
    )},
    { path: 'employee/:id/edit', loadComponent: ()=> import('./components/employee-add-or-edit/employee-add-or-edit.component').then(
        c => c.EmployeeAddOrEditComponent
    )},
];
