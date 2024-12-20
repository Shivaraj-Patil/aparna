import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EmployeeState } from './employee.reducer';
// sekects the global state using the key employee
export const selectEmployeeState = createFeatureSelector<EmployeeState>('employee');
// selects the employees from the global state from any of the component
export const selectAllEmployees = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.employees
);
// selects the employee by id from the global state from any of the component
export const selectEmployeeById = (employeeId: number) => createSelector( 
  selectAllEmployees, (employees) => employees.find(employee => employee.id === employeeId) );  