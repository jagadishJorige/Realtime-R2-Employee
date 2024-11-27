import { Inject, Injectable, signal } from '@angular/core';

import { DatabaseService } from '../../../shared/services/database-service.service';
import { Employee } from '../../../shared/models/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStoreService {
  
  private _employees = signal<Employee[]>([]);
  employees = this._employees.asReadonly();

  constructor(@Inject(DatabaseService) private dbService: DatabaseService) {
    this.loadEmployees();
  }

  private async loadEmployees(): Promise<void> {
    const employees = await this.dbService.getAllEmployees();
    this._employees.set(employees);
  }

  async addEmployee(employee: Employee): Promise<void> {
    await this.dbService.addEmployee(employee);
    this.loadEmployees();
  }

  async getEmployeeDetailsById(id: number): Promise<Employee | undefined> {
    return await this.dbService.getEmployeeById(id);
  }

  async updateEmployee(employee: Employee): Promise<void> {
    await this.dbService.updateEmployee(employee);
    this.loadEmployees();
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.dbService.deleteEmployee(id);
    this.loadEmployees();
  }
}
