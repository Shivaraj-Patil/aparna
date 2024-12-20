// src/app/store/app.state.ts
import { EmployeeState } from './employee.reducer';

export interface AppState {
  employee: EmployeeState;
}