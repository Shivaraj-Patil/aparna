import { createReducer, on } from '@ngrx/store';
import { Employee } from '../models/employee';
import * as EmployeeActions from './employee.actions';

export interface EmployeeState {
  employees: Employee[];
}

export const initialState: EmployeeState = {
  employees: []
};

console.log('Initial State:', initialState);
export const employeeReducer = createReducer(
  initialState,
  on(EmployeeActions.loadEmployees, (state, { employees }) => {
    console.log('Load Employees:', employees);
    return {
      ...state,
      employees: [...employees]
    };
  }),

  on(EmployeeActions.addReportee, (state, { employee }) => {
    console.log('Add Reportee:', employee);
    const updatedEmployees = state.employees.map(emp => {
      if (emp.id === employee.managerId) {
        return {
          ...emp,
          children: [...emp.children, employee]
        };
      }
      return emp;
    });

    console.log('Updated Employees:', updatedEmployees);
    return {
      ...state,
      employees: updatedEmployees
    };
  }),

  on(EmployeeActions.editEmployee, (state, { employee }) => {
    console.log('Edit Employee:', employee);
    return {
      ...state,
      employees: state.employees.map(emp => emp.id === employee.id ? employee : emp)
    };
  }),

  on(EmployeeActions.deleteEmployee, (state, { employeeId }) => {
    console.log('Delete Employee:', employeeId);
  
    const removeEmployeeFromChildren = (employees: Employee[], employeeId: number): Employee[] => {
      return employees
        .filter(emp => emp.id !== employeeId)
        .map(emp => ({
          ...emp,
          children: removeEmployeeFromChildren(emp.children, employeeId)
        }));
    };
  
    return {
      ...state,
      employees: removeEmployeeFromChildren(state.employees, employeeId)
    };
  }),
  on(EmployeeActions.changeReportingLine, (state, { employeeId, newManagerId }) => {
    console.log('Change Reporting Line:', employeeId, newManagerId);
    const newManager = state.employees.find(emp => emp.id == newManagerId);
    console.log(newManager)
    const newManagerName = newManager ? newManager.name : '';

    return {
      ...state,
      employees: state.employees.map(emp => 
        emp.id === employeeId ? { ...emp, managerId: newManagerId, managerName: newManagerName } : emp
      )
    };
  }),
  
  on(EmployeeActions.updateManagerAndChildren, (state, { employeeId, newManagerId, currentManagerId }) => {
    console.log('Update Manager And Children:', employeeId, newManagerId, currentManagerId);

    const newManager = state.employees.find(emp => emp.id === newManagerId);
    const newManagerName = newManager ? newManager.name : '';

    // Remove the employee from the children of the current manager
    const updatedEmployees = state.employees.map(emp => {
      if (emp.id === currentManagerId) {
        return {
          ...emp,
          children: emp.children.filter(child => child.id !== employeeId)
        };
      }
      return emp;
    });

    // Update the employee's manager information
    const employeesWithUpdatedManager = updatedEmployees.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          managerId: newManagerId,
          managerName: newManagerName
        };
      }
      return emp;
    });

    // Add the employee to the children of the new manager
    const finalUpdatedEmployees = employeesWithUpdatedManager.map(emp => {
      if (emp.id === newManagerId) {
        const employeeToAdd = employeesWithUpdatedManager.find(emp => emp.id === employeeId);
        return {
          ...emp,
          children: [...emp.children, employeeToAdd as Employee]
        };
      }
      return emp;
    });

    return {
      ...state,
      employees: finalUpdatedEmployees
    };
  }),   
);
