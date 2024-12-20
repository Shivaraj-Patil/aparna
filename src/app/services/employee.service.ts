// filepath: /src/app/services/employee.service.ts
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Employee } from '../models/employee';
import { AppState } from '../store/employee.state';
import { loadEmployees } from '../store/employee.actions';
import orgdata from '../../assets/json/employee.json';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  employees: Employee[] = [];
  employeesUpdated = new Subject<Employee[]>();

  constructor(private store: Store<AppState>) {
    this.store.pipe(select(state => state.employee.employees)).subscribe(employees => {
      this.employees = employees;
      this.employeesUpdated.next(this.employees);
      this.saveEmployeesToLocalStorage(this.employees);
    });
  }

  onReporteeAdded() {
    this.store.pipe(select(state => state.employee.employees), take(1)).subscribe(employees => {
      const updatedEmployees: Employee[] = this.flattenEmployees(employees);
      this.store.dispatch(loadEmployees({ employees: updatedEmployees }));
      this.employeesUpdated.next(updatedEmployees);
      this.saveEmployeesToLocalStorage(updatedEmployees);
    });
  }

  private flattenEmployees(employees: any[]): Employee[] {
    let flattenedEmployees: Employee[] = [];
    let processedIds = new Set<number>();

    const traverse = (emp: any) => {
      if (!processedIds.has(emp.id)) {
        processedIds.add(emp.id);
        flattenedEmployees.push({
          id: emp.id,
          name: emp.name,
          designation: emp.designation,
          email: emp.email,
          phone: emp.phone,
          managerId: emp.managerId,
          managerName: emp.managerName,
          children: emp.children ? emp.children.map((child: any) => traverse(child)) : []
        });
      }
      return {
        id: emp.id,
        name: emp.name,
        designation: emp.designation,
        email: emp.email,
        phone: emp.phone,
        managerId: emp.managerId,
        managerName: emp.managerName,
        children: emp.children ? emp.children.map((child: any) => traverse(child)) : []
      };
    };

    employees.forEach(emp => traverse(emp));
    return flattenedEmployees;
  }

  loadAllEmployees() {
    this.store.pipe(select(state => state.employee.employees), take(1)).subscribe(employees => {
      if (employees.length === 0) {
        const localStorageEmployees = this.getEmployeesFromLocalStorage();
        if (localStorageEmployees.length > 0) {
          this.store.dispatch(loadEmployees({ employees: localStorageEmployees }));
        } else {
          const flattenedEmployees: Employee[] = this.flattenEmployees([orgdata]);
          this.store.dispatch(loadEmployees({ employees: flattenedEmployees }));
        }
      } else {
        this.store.dispatch(loadEmployees({ employees }));
      }
      this.employeesUpdated.next(employees);
    });
  }

  private saveEmployeesToLocalStorage(employees: Employee[]): void {
    localStorage.setItem('employees', JSON.stringify(employees));
  }

  private getEmployeesFromLocalStorage(): Employee[] {
    const employees = localStorage.getItem('employees');
    return employees ? JSON.parse(employees) : [];
  }
}