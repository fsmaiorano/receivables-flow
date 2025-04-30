import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private toggleSource = new Subject<void>();

  toggleSidenav$ = this.toggleSource.asObservable();

  toggle() {
    this.toggleSource.next();
  }
}
