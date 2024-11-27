import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {
  employees: Dexie.Table<Employee, number>;

  constructor() { 
    super('EmployeeDatabase');
    this.version(1).stores({
      employees: '++id, name, position, fromDate, toDate'
    });

    this.employees = this.table('employees');
  }

  async addEmployee(employee: Employee): Promise<number> {
    return await this.employees.add(employee);
  }
  
  async getEmployeeById(id: number): Promise<Employee | undefined> {
    return await this.employees.get(id);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await this.employees.toArray();
  }

  async updateEmployee(employee: Employee): Promise<void> {
    await this.employees.put(employee);
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.employees.delete(id);
  }
}
