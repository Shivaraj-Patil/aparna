// src/app/store/employee.actions.ts
import { createAction, props } from '@ngrx/store';
import { Employee } from '../models/employee';


export const loadEmployees = createAction(
    '[Employee] Load Employees',
    props<{ employees: Employee[] }>()
);
export const loadEmployeesSuccess = createAction('[Employee] Load Employees Success', props<{ employees: Employee[] }>());

export const addReportee = createAction('[Employee] Add Reportee', props<{ employee: Employee }>());
export const editEmployee = createAction('[Employee] Edit Employee', props<{ employee: Employee }>());
export const deleteEmployee = createAction('[Employee] Delete Employee', props<{ employeeId: number }>());
export const changeReportingLine = createAction('[Employee] Change Reporting Line', props<{ employeeId: number, newManagerId: number }>());
export const updateManagerAndChildren = createAction(
    '[Employee] Update Manager And Children',
    props<{ employeeId: number, newManagerId: number, currentManagerId: number }>()
);

