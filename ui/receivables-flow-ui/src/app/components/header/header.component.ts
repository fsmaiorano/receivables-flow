import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SidenavService } from '../../shared/services/sidenav.service';

@Component({
  selector: 'app-header',
  imports: [SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent {
  constructor(private sidenavService: SidenavService) {}

  toggleSidenav() {
    this.sidenavService.toggle();
  }
}
