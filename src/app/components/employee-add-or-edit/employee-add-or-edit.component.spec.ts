import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAddOrEditComponent } from './employee-add-or-edit.component';

describe('EmployeeAddOrEditComponent', () => {
  let component: EmployeeAddOrEditComponent;
  let fixture: ComponentFixture<EmployeeAddOrEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAddOrEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAddOrEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
