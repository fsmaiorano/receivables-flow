import { Component, ViewChild, inject, OnDestroy } from '@angular/core';
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
export class SidenavComponent implements OnDestroy {
  private _formBuilder = inject(FormBuilder);
  private sidenavSubscription: Subscription;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  options = this._formBuilder.group({
    fixed: [false],
  });

  constructor(private sidenavService: SidenavService) {
    this.sidenavSubscription = this.sidenavService.toggleSidenav$.subscribe(
      () => {
        if (this.sidenav) {
          this.sidenav.toggle();
        }
      },
    );
  }

  ngOnDestroy() {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }
}
