import { Component, computed, effect, inject, Inject, Signal, signal, WritableSignal  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageTitleStoreService } from '../../shared/services/page-title-store.service';
import { BottomSheetComponent } from '../../shared/bottom-sheet/bottom-sheet.component';
import { DatepickerComponent } from '../../shared/datepicker/datepicker.component';
import { EmployeeStoreService } from '../employees/service/employee-store.service';
import { Employee } from '../../shared/models/Employee';
import { delay, timer } from 'rxjs';
import { DatabaseService } from '../../shared/services/database-service.service';
import { CommonStateService } from '../../shared/services/common-state.service';

@Component({
  selector: 'app-employee-add-or-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-add-or-edit.component.html',
  styleUrl: './employee-add-or-edit.component.scss'
})
export class EmployeeAddOrEditComponent {
  
  private _bottomSheet = inject(MatBottomSheet);
  private _dialog = inject(MatDialog);

  employeeName = signal('');
  employeePosition = signal('');
  fromDate: WritableSignal<string | Date> = signal('');
  toDate: WritableSignal<string | Date> = signal('');

  employee: Partial<Employee> = {};

  private _snackBar =  inject(MatSnackBar);

  employeeId!:number;
  private subscription: any;
  private deleteSubscription: any;
  
  constructor(@Inject(PageTitleStoreService)
  private pageTitleService: PageTitleStoreService,
  @Inject(EmployeeStoreService)
  private employeeStore: EmployeeStoreService,
  @Inject(CommonStateService) private sharedStore: CommonStateService,
  public router: Router, private activatedRoute: ActivatedRoute) {
    this.pageTitleService.setTitle('Add Employee Details');
    this.subscription = this.activatedRoute.params.subscribe(params => {
      this.employeeId = parseInt(params['id']);
      if(this.employeeId) this.fetchEmployeeById(this.employeeId), this.pageTitleService.setTitle('Edit Employee Details');;
    });
  }

  ngOnInit(): void {
    this.deleteSubscription = this.sharedStore.deleteContinue$.subscribe((res)=> {
      if(res) {
        this.deleteEmployee();
      }
    });
  }

  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.deleteSubscription.unsubscribe();
    this._dialog.closeAll();
  }

  async fetchEmployeeById(id: number): Promise<void> {
    const empDetails = await this.employeeStore.getEmployeeDetailsById(id);
    this.employee = {...empDetails};
    const { name, position, fromDate, toDate } = this.employee;
    this.employeeName.set(name || '');
    this.employeePosition.set(position || '');
    const fromDateLocale = fromDate ? new Date(fromDate) : '';
    const toDateLocale = toDate ? new Date(toDate) : '';
    if(fromDateLocale) { this.fromDate.set(fromDateLocale) };
    if(toDateLocale) { this.toDate.set(toDateLocale) };
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.employeeName.set(input.value);
  }

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(BottomSheetComponent);
    bottomSheetRef.afterDismissed().subscribe(result => {
      if(result) {
        this.employeePosition.set(result);
      }
    });
  }

  openDatePicker(event: MouseEvent, dpType: string): void {
    if (this._dialog.openDialogs.length > 0) {
      return;
    }
    const dialogRef = this._dialog.open(DatepickerComponent, {
      disableClose: false,
      // height: '450px',
      width: '450px',
      autoFocus: false,
      data: { type:  dpType, dateObj: {'fromDate': this.fromDate(), 'toDate': this.toDate() } }
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result || result === null) {
        if(dpType === 'fromDate') {
          this.fromDate.set(result);
        } else {
          this.toDate.set(result);
        }
      }
    });
  }

  loader = signal(false);
  formSubmitted = signal(false);

  async saveEmployee(): Promise<void> {
    try {
      this.loader.set(true);
      this.formSubmitted.set(true);
      if(this.employeeName() && this.employeePosition() && this.fromDate()) {
        this.employee.name = this.employeeName();
        this.employee.position = this.employeePosition();

        const fromDateUtcFormat = this.fromDate() ? new Date(this.fromDate()).toISOString() : null;
        this.employee.fromDate = fromDateUtcFormat;

        const toDateUtcFormat = this.toDate() ? new Date(this.toDate()).toISOString() : null;
        this.employee.toDate = toDateUtcFormat;
        setTimeout(() => {},1500);
        if(this.employeeId) {
          await this.employeeStore.updateEmployee(this.employee as Employee);
        } else {
          await this.employeeStore.addEmployee(this.employee as Employee);
        }
      
        this.showSnakBar('Employee Created Successfully');
        await this.resetEmployeeDetails();
        this.redirectTo();
      } else {
        throw new Error("Please fill employee details");
      }
    } catch(error: any) {
      console.log(error.error, typeof(error));
      this.showSnakBar('Please fill employee details');
    } finally {
      this.loader.set(false);
      this.formSubmitted.set(false);
    }
  }

  async deleteEmployee(): Promise<void> {
    try {
      if(!this.employeeId) throw new Error('Employee ID is Not available');
      await this.employeeStore.deleteEmployee(this.employeeId);
      setTimeout(() => {}, 1000);
      this.sharedStore.clickedOnDelete(false);
      this.showSnakBar('Employee Deleted Successfully');
      this.redirectTo();
    } catch {
      console.error("Delete Operation Failed");
      this.showSnakBar('Employee ID is Not available');
    }
  }

  redirectTo(): void {
    this.router.navigate(['/employees']);
  }

  resetEmployeeDetails():void {
    this.employee = {};
    this.employeeName.set('');
    this.employeePosition.set('');
    this.fromDate.set('');
    this.toDate.set('');
  }

  showSnakBar(message: string) {
    this._snackBar.open(message, 'Ok', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'multiline-snackbar',
    });
}
}
