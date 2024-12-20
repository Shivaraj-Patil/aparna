import { Route } from '@angular/router';
import { OrganizationTreeComponent } from './component/organization-tree/organization-tree.component';
import { EmployeeDetailsComponent } from './component/employee-details/employee-details.component';
import { EmployeeComponent } from './component/employee/employee.component';

export const routes: Route[] = [
  { path: 'employee/:id', component: OrganizationTreeComponent },
  { path: 'employees', component: EmployeeComponent },
  { path: 'org-chart', component: OrganizationTreeComponent },
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: '**', redirectTo: '/employees', pathMatch: 'full' },
];