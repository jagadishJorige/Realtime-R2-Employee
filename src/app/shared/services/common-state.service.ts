import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonStateService {

  constructor() { }

  private readonly _deleteContinue = new BehaviorSubject<boolean>(false);
  readonly deleteContinue$ = this._deleteContinue.asObservable();

  get deleteContinue(): boolean {
      return this._deleteContinue.getValue();
  }
  set deleteContinue(val: boolean) {
      this._deleteContinue.next(val);
  }


  clickedOnDelete(val: boolean) {
    this.deleteContinue = val;
  }
}
