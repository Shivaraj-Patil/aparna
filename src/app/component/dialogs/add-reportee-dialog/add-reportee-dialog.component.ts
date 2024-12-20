import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/employee.state';
import { addReportee } from '../../../store/employee.actions';
import { Employee } from '../../../models/employee';

@Component({
  selector: 'app-add-reportee-dialog',
  templateUrl: './add-reportee-dialog.component.html',
  styleUrls: ['./add-reportee-dialog.component.css'],
  standalone: true,
  imports: [ClarityModule, CommonModule, FormsModule]
})
export class AddReporteeDialogComponent implements OnChanges {
  @Input() open: boolean = false;
  @Input() manager!: Employee;
  @Output() close = new EventEmitter<void>();

  newReportee: Employee = {
    id: 0,
    name: '',
    designation: '',
    email: '',
    phone: '',
    managerId: 0,
    managerName: '',
    children: []
  };
  designations = [
    { designation: "CEO" },
    { designation: "CTO" },
    { designation: "Team Lead" },
    { designation: "Manager" },
    { designation: "Developer" }
  ];
  constructor(private store: Store<AppState>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['manager'] && this.manager) {
      this.newReportee.managerId = this.manager.id;
      this.newReportee.managerName = this.manager.name;
    }
  }

  onSaveClick(form: NgForm): void {
    if (form.valid) {
      this.newReportee.id = this.generateId();
      this.newReportee.managerId = this.manager.id;
      this.newReportee.managerName = this.manager.name;
      this.store.dispatch(addReportee({ employee: this.newReportee }));
      this.open = false;
      this.close.emit();
    }
  }

  cancel(): void {
    this.open = false;
    this.close.emit();
  }

  private generateId(): number {
    return Math.floor(Math.random() * 10000);
  }
}