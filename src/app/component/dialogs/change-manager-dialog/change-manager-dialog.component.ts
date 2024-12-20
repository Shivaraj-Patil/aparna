import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Employee } from '../../../models/employee';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/employee.state';
import { map } from 'rxjs/operators';
import { changeReportingLine, updateManagerAndChildren } from '../../../store/employee.actions';
import { roles} from '../../../models/deisgnation';
@Component({
  selector: 'app-change-manager-dialog',
  templateUrl: './change-manager-dialog.component.html',
  styleUrls: ['./change-manager-dialog.component.css'],
  imports: [ClarityModule, CommonModule, FormsModule],
  standalone: true
})
export class ChangeManagerDialogComponent implements OnChanges {
  @Input() open: boolean = false;
  @Input() employee: Employee | undefined;
  @Output() close = new EventEmitter<void>();

 
  employees$!: Observable<Employee[]>;
  managers$!: Observable<Employee[]>;
  selectedManagerId!: number;


  constructor(private store: Store<AppState>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employee'] && this.employee) {
      this.employee = { ...this.employee }; 
    }
  }

  ngOnInit(): void {
   
    this.employees$ = this.store.pipe(select(state => state.employee.employees));
    this.managers$ = this.employees$.pipe(
      map(employees => employees.filter(employee => 
        employee.id !== this.employee?.managerId &&
        employee.id !== this.employee?.id && // Ensure the person himself is not included
        roles.designations.some(role => role.designation.toLowerCase() === employee.designation.toLowerCase() && role.add_reportee) // Check if the role can add subordinates
      ))
    )
    
  }


  private changeManager(managerId: number): void {
    if (this.employee) {
      const currentManagerId = this.employee.managerId;
      const children = this.employee.children || [];
      console.log('Dispatching updateManagerAndChildren:', this.employee.id, managerId, children, currentManagerId);
      this.store.dispatch(updateManagerAndChildren({ employeeId: this.employee.id, newManagerId: Number(this.selectedManagerId), currentManagerId:this.employee.managerId }));
    }
  }

  onManagerChange(managerId: number): void {
    this.changeManager(managerId);
  }

  onSaveClick(): void {
    this.changeManager(this.selectedManagerId);
    this.open = false;
  }

  onCancelClick(): void {
    this.open = false;

  }
}