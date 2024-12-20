import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { loadEmployees, changeReportingLine, editEmployee, deleteEmployee, addReportee } from '../../store/employee.actions';
import { Employee } from '../../models/employee';
import { AppState } from '../../store/employee.state';
import orgdata from '../../../assets/json/employee.json';
import { ChangeManagerDialogComponent } from '../dialogs/change-manager-dialog/change-manager-dialog.component';
import { FormsModule } from '@angular/forms';
import { AddReporteeDialogComponent } from '../dialogs/add-reportee-dialog/add-reportee-dialog.component';
import { EditEmployeeDialogComponent } from '../dialogs/edit-employee-dialog/edit-employee-dialog.component';
import { DeleteEmployeeDialogComponent } from '../dialogs/delete-employee-dialog/delete-employee-dialog.component';
import { OrganizationTreeComponent } from '../organization-tree/organization-tree.component';
import { Designation, Roles } from '../../models/deisgnation';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  standalone: true,
  imports: [CommonModule,OrganizationTreeComponent, EditEmployeeDialogComponent,DeleteEmployeeDialogComponent, ClarityModule, ChangeManagerDialogComponent, AddReporteeDialogComponent, FormsModule]
})
export class EmployeeComponent implements OnInit {
   @ViewChild('dialogContainer', { read: ViewContainerRef, static: true }) dialogContainer!: ViewContainerRef;
   employees: Employee[] = [];
  selectedEmployee!: Employee;
  showChangeManagerDialog: boolean = false;
  showAddEmployeeDialog: boolean = false;
  showAddReporteeDialog: boolean = false;
  showEditEmployeeDialog: boolean = false;
  showDeleteEmployeeDialog: boolean = false;
  isGridView: boolean = true;
  filteredDesignations: Designation[] = [];
  constructor(private store: Store<AppState>,private router: Router, private empService: EmployeeService,) {
    this.empService.loadAllEmployees();
    this.employees = this.empService.employees;
  }


  ngOnInit(): void {
   
    this.employees = this.empService.employees;
    this.empService.employeesUpdated.subscribe((employees: Employee[]) => {
      this.employees = employees;
    });
  }
  onEmployeeEdited(employee: Employee) {
   
    this.selectedEmployee ={...employee}
    const componentRef = this.dialogContainer.createComponent(EditEmployeeDialogComponent);
    componentRef.instance.open = true;
    componentRef.instance.employee = this.selectedEmployee;
    componentRef.instance.save.subscribe(() => {
      componentRef.destroy();
   
    });
    componentRef.instance.cancel.subscribe(() => {
      componentRef.destroy();

    });
  }

  deleteEmployee(employee: Employee) {
   
    this.selectedEmployee = { ...employee };
    const componentRef = this.dialogContainer.createComponent(DeleteEmployeeDialogComponent);
    componentRef.instance.open = true;
    componentRef.instance.employee = this.selectedEmployee;
    componentRef.instance.close.subscribe(() => {
      componentRef.destroy();
    });
  }

  changeReportingLine(employee: Employee): void {
   
    this.selectedEmployee = employee;
    const componentRef = this.dialogContainer.createComponent(ChangeManagerDialogComponent);
    componentRef.instance.open = true;
    componentRef.instance.employee = this.selectedEmployee;
    componentRef.instance.close.subscribe(() => {
      componentRef.destroy();
    });
  }   
  addReportee(employee: Employee) {
   
    this.selectedEmployee = { ...employee };
    const componentRef = this.dialogContainer.createComponent(AddReporteeDialogComponent);
    componentRef.instance.open = true;
    componentRef.instance.manager = this.selectedEmployee;
    componentRef.instance.close.subscribe(() => {
      componentRef.destroy();
      this.empService.onReporteeAdded();
    });
  }
  toggleView() {
    this.router.navigate(['/org-chart']);
  }
}
