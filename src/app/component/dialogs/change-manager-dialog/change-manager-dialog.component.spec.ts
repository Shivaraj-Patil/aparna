import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeManagerDialogComponent } from './change-manager-dialog.component';

describe('ChangeManagerDialogComponent', () => {
  let component: ChangeManagerDialogComponent;
  let fixture: ComponentFixture<ChangeManagerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeManagerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeManagerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
