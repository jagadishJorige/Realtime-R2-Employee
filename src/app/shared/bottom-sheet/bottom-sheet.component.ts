import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import {MatListModule} from '@angular/material/list';
import { BehaviorSubject } from 'rxjs';


export interface PositionsModel {
  label: string,
  value: string
}

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
  ],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomSheetComponent {
  private _bottomSheetRef =
  inject<MatBottomSheetRef<BottomSheetComponent>>(MatBottomSheetRef);

  samplePostions: string[] = [
    'Senior Software Developer',
    'Product Designer',
    'Flutter Developer',
    'QA Tester',
    'Product Owner'
  ]
  private readonly _positions = new BehaviorSubject<string[]>(this.samplePostions);
  readonly positions$ = this._positions.asObservable();


  set positions(val: string[]) {
    this._positions.next(val);
  }

  get positions(): string[] {
      return this._positions.getValue();
  }

  posTrack = (i: number, role: string): string => role;

  selectedPos(event: MouseEvent, role: string): void {
    this._bottomSheetRef.dismiss(role);
    event.preventDefault();
  }
}
