import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  standalone: true,
  imports: [SharedModule, CommonModule, RouterLink],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];
  subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.subscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumbs();
      });

    this.breadcrumbs = this.buildBreadcrumbs();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private buildBreadcrumbs(): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];

    breadcrumbs.push({
      label: 'Home',
      url: '/dashboard',
      icon: 'home',
    });

    const urlSegments = this.router.url.split('/').filter((segment) => segment);

    if (urlSegments.length === 0) {
      return breadcrumbs;
    }

    let currentUrl = '';

    for (const segment of urlSegments) {
      currentUrl += `/${segment}`;

      if (segment === 'dashboard') {
        continue;
      }

      const label = segment.charAt(0).toUpperCase() + segment.slice(1);

      let icon: string | undefined;

      switch (segment) {
        case 'payables':
          icon = 'payment';
          break;
        case 'assignors':
          icon = 'business';
          break;
        case 'reports':
          icon = 'assessment';
          break;
      }

      breadcrumbs.push({
        label,
        url: currentUrl,
        icon,
      });
    }

    return breadcrumbs;
  }
}
