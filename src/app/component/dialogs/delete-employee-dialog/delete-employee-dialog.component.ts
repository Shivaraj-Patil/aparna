import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/employee.state';
import { deleteEmployee, changeReportingLine } from '../../../store/employee.actions';
import { Employee } from '../../../models/employee';
@Component({
  selector: 'app-delete-employee-dialog',
  templateUrl: './delete-employee-dialog.component.html',  
  styleUrls: ['./delete-employee-dialog.component.css'],
  standalone: true,   
  imports: [ClarityModule, CommonModule, FormsModule]
})
export class DeleteEmployeeDialogComponent implements OnChanges {
  @Input() open: boolean = false;
  @Input() employee!: Employee;
  @Output() close = new EventEmitter<void>();

  constructor(private store: Store<AppState>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['employee'] && this.employee) {
      this.employee = { ...this.employee };
    }
  }
  onDeleteClick(): void {
    if (this.employee) {
      const newManagerId = this.employee.managerId;
      if (newManagerId !== null) {
        console.log(this.employee.children)
        console.log(`Employee ${this.employee.id} has manager ${newManagerId}. Reassigning reportees...`);
        this.employee.children.forEach(reportee => {
          console.log(`Reassigning reportee ${reportee.id} to new manager ${newManagerId}`);
          this.store.dispatch(changeReportingLine({ employeeId: reportee.id, newManagerId }));
        });
      } else {
        console.log(`Employee ${this.employee.id} has no manager. Skipping reassignment.`);
      }
      console.log(`Deleting employee ${this.employee.id}`);
      this.store.dispatch(deleteEmployee({ employeeId: this.employee.id }));
      this.open = false;
      this.close.emit();
    }
  }
  onCancelClick(): void {
    this.open = false;
    this.close.emit();
  }
}