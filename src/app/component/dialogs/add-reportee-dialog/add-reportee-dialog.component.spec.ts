import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReporteeDialogComponent } from './add-reportee-dialog.component';

describe('AddReporteeDialogComponent', () => {
  let component: AddReporteeDialogComponent;
  let fixture: ComponentFixture<AddReporteeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReporteeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReporteeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
