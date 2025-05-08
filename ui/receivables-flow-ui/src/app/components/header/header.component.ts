import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SidenavService } from '../../shared/services/sidenav.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  private sidenavSubscription: Subscription = new Subscription();

  constructor(private sidenavService: SidenavService) {}

  ngOnInit() {
    this.sidenavSubscription = this.sidenavService.stateChange$.subscribe(
      (isOpen: boolean) => {
        this.isMenuOpen = isOpen;
      },
    );
  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  ngOnDestroy() {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }
}
