import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/employee.state';
import { editEmployee } from '../../../store/employee.actions';
import { Employee } from '../../../models/employee';

@Component({
  selector: 'app-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.css'],
  standalone: true,
  imports: [ClarityModule, CommonModule, FormsModule]
})
export class EditEmployeeDialogComponent {
  @Input() open: boolean = false;
  @Input() employee!: Employee;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  designations = [
    { designation: "CEO" },
    { designation: "CTO" },
    { designation: "Team Lead" },
    { designation: "Manager" },
    { designation: "Developer" }
  ];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.employee = { ...this.employee };
  }

  onSaveClick(): void {
    this.store.dispatch(editEmployee({ employee: this.employee }));
    this.open = false;
    this.save.emit();
  }

  onCancelClick(): void {
    this.open = false;
    this.cancel.emit();
  }
}