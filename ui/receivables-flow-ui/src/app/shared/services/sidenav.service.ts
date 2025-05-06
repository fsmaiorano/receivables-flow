import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private toggleSource = new Subject<void>();
  private stateChangeSource = new Subject<boolean>();

  toggleSidenav$ = this.toggleSource.asObservable();
  stateChange$ = this.stateChangeSource.asObservable();

  toggle() {
    this.toggleSource.next();
  }

  notifyStateChange(isOpen: boolean) {
    this.stateChangeSource.next(isOpen);
  }
}
