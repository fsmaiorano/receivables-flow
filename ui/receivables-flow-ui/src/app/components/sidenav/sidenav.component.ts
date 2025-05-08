import {
  Component,
  ViewChild,
  inject,
  OnDestroy,
  NgZone,
  OnInit,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../../shared/services/sidenav.service';
import { Subscription } from 'rxjs';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-sidenav',
  imports: [SharedModule, BreadcrumbComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  standalone: true,
})
export class SidenavComponent implements OnInit, AfterViewInit, OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private sidenavSubscription: Subscription = new Subscription();
  private openedChangeSubscription: Subscription | null = null;
  private readonly SMALL_SCREEN_BREAKPOINT = 1024;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  options = this._formBuilder.group({
    fixed: [false],
  });

  constructor(
    private sidenavService: SidenavService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.sidenavSubscription.add(
      this.sidenavService.toggleSidenav$.subscribe(() => {
        if (this.sidenav) {
          this.sidenav.toggle();
          this.sidenavService.notifyStateChange(this.sidenav.opened);
        }
      }),
    );
  }

  ngAfterViewInit() {
    this.setupSidenavEventListeners();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.ngZone.run(() => {
      if (this.sidenav) {
        if (window.innerWidth < this.SMALL_SCREEN_BREAKPOINT) {
          this.sidenav.mode = 'over';
          this.sidenav.disableClose = false;
          this.sidenav.autoFocus = false;
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.disableClose = false;
        }

        if (
          this.sidenav.opened &&
          window.innerWidth < this.SMALL_SCREEN_BREAKPOINT
        ) {
          this.sidenav.close();
          this.sidenavService.notifyStateChange(false);
        }
      }
    });
  }

  private setupSidenavEventListeners() {
    if (this.sidenav) {
      if (this.openedChangeSubscription) {
        this.openedChangeSubscription.unsubscribe();
      }

      this.openedChangeSubscription = this.sidenav.openedChange.subscribe(
        (isOpen: boolean) => {
          console.log('Sidenav state changed:', isOpen);
          this.sidenavService.notifyStateChange(isOpen);
        },
      );

      this.sidenavSubscription.add(this.openedChangeSubscription);
    }
  }

  ngOnDestroy() {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }
}
