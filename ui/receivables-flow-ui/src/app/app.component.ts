import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { filter } from 'rxjs/operators';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    SharedModule,
    HeaderComponent,
    SidenavComponent,
    NgIf,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'receivables-flow-ui';
  isLoginRoute = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Set initial state based on the starting URL
    this.isLoginRoute = this.router.url === '/' || this.router.url === '';

    // Listen to route changes
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe((event: Event) => {
        const navigationEnd = event as NavigationEnd;
        this.isLoginRoute =
          navigationEnd.url === '/' || navigationEnd.url === '';
      });
  }
}
