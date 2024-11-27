import { Component, computed, effect, Inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';

import { Employee } from '../../shared/models/Employee';
import { PageTitleStoreService } from '../../shared/services/page-title-store.service';
import { EmployeeStoreService } from './service/employee-store.service';



@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent {
  employees!: Signal<Employee[]>;
  currentEmployees = computed(() =>
    this.employees().filter(
      (employee) => employee.fromDate && !employee.toDate
    )
  );

  previousEmployees = computed(() =>
    this.employees().filter((employee) => employee.fromDate && employee.toDate)
  );


  constructor(
    @Inject(PageTitleStoreService)
    private pageTitleService: PageTitleStoreService,
    @Inject(EmployeeStoreService)
    private employeeStore: EmployeeStoreService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.pageTitleService.setTitle('Employee List');
    this.employees = this.employeeStore.employees;
  }

  onAddEmployee(): void {
    this.router.navigate(['employee/create']);
  }

  onEditDetails(emp: Employee): void {
    const {id} = emp;
    this.router.navigate([`employee/${id}/edit`]);
  }

  deleteEmployee(emp: Employee): void {
    const {id} = emp;
    if(id) this.employeeStore.deleteEmployee(id);
  }
}
