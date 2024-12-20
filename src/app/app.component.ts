import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployeeComponent } from './component/employee/employee.component';
import { OrganizationTreeComponent } from './component/organization-tree/organization-tree.component';
@Component({
  selector: 'app-root',
  standalone:true,
  imports:[EmployeeComponent,OrganizationTreeComponent,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {   
  title = 'OragnizationHierarchy';
}
