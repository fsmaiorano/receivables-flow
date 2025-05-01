import {
  Component,
  ViewChild,
  inject,
  OnDestroy,
  NgZone,
  OnInit,
  HostListener,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../../shared/services/sidenav.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  imports: [SharedModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  standalone: true,
})
export class SidenavComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private sidenavSubscription: Subscription;
  private readonly SMALL_SCREEN_BREAKPOINT = 1024;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  options = this._formBuilder.group({
    fixed: [false],
  });

  constructor(
    private sidenavService: SidenavService,
    private ngZone: NgZone,
  ) {
    this.sidenavSubscription = this.sidenavService.toggleSidenav$.subscribe(
      () => {
        if (this.sidenav) {
          this.sidenav.toggle();
        }
      },
    );
  }

  ngOnInit() {
    // Check initial screen size
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.ngZone.run(() => {
      if (window.innerWidth < this.SMALL_SCREEN_BREAKPOINT) {
        this.sidenav.mode = 'over';
        this.sidenav.disableClose = true;
      }
      if (window.innerWidth >= this.SMALL_SCREEN_BREAKPOINT) {
        this.sidenav.mode = 'side';
        this.sidenav.disableClose = false;
      }
      if (this.sidenav && this.sidenav.opened) {
        this.sidenav.close();
      }
    });
  }

  ngOnDestroy() {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }
}
