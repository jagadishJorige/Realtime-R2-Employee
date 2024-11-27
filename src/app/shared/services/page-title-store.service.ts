import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageTitleStoreService {
  private readonly _pageTitle = new BehaviorSubject<string>('');
  readonly pageTitle$ = this._pageTitle.asObservable();

  set pageTitle(val: string) {
    this._pageTitle.next(val);
  }

  get pageTitle(): string {
    return this._pageTitle.getValue();
  }

  setTitle(title: string) {
    this.pageTitle = title;
  }
}
