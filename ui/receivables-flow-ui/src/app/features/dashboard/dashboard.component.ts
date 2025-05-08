import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { PayablesComponent } from '../payables/payables.component';
import { PayableService } from '../core/data/http/payable/payable.service';
import { AssignorService } from '../core/data/http/assignor/assignor.service';
import { forkJoin, catchError, of } from 'rxjs';
import { MaxPipe } from '../../shared/pipes/max.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [SharedModule, MaxPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DashboardComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private payableService = inject(PayableService);
  private assignorService = inject(AssignorService);
  private cdr = inject(ChangeDetectorRef);

  // Dashboard statistics
  totalPayables = 0;
  totalAssignors = 0;
  totalAmount = 0;
  recentActivity = 10;
  isLoading = true;

  // Chart data
  monthlyPayables: { month: string; amount: number }[] = [];
  assignorDistribution: { name: string; count: number }[] = [];

  // Random colors for charts
  chartColors: string[] = [
    '#4285F4',
    '#EA4335',
    '#FBBC05',
    '#34A853', // Google colors
    '#7986CB',
    '#33B679',
    '#8E24AA',
    '#E67C73',
    '#F6BF26',
    '#F4511E',
    '#039BE5',
    '#0B8043',
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    console.log('Loading dashboard data...');
    this.isLoading = true;
    this.cdr.detectChanges();

    forkJoin([
      this.payableService.getPayables(1, 1000).pipe(
        catchError((error) => {
          console.error('Error fetching payables:', error);
          return of({
            isSuccess: false,
            data: null,
            error: 'Failed to load payables',
          });
        }),
      ),
      this.assignorService.getAssignors(1, 1000).pipe(
        catchError((error) => {
          console.error('Error fetching assignors:', error);
          return of({
            isSuccess: false,
            data: null,
            error: 'Failed to load assignors',
          });
        }),
      ),
    ]).subscribe({
      next: ([payablesResult, assignorsResult]) => {
        console.log('API responses received:', {
          payablesResult,
          assignorsResult,
        });

        // Process payables data
        if (payablesResult.isSuccess && payablesResult.data) {
          this.totalPayables = payablesResult.data.meta.totalItems;

          // Calculate total amount
          this.totalAmount = payablesResult.data.items.reduce(
            (sum, payable) => sum + parseFloat(payable.value.toString()),
            0,
          );

          // Generate monthly data for the last 6 months
          this.generateMonthlyData(payablesResult.data.items);
        } else {
          console.warn('No payables data available or request failed');
          this.totalPayables = 0;
          this.totalAmount = 0;
          this.monthlyPayables = this.generateDummyMonthlyData();
        }

        // Process assignors data
        if (assignorsResult.isSuccess && assignorsResult.data) {
          this.totalAssignors = assignorsResult.data.meta.totalItems;

          // Generate assignor distribution data
          if (assignorsResult.data.items.length > 0) {
            this.generateAssignorDistribution(
              payablesResult.isSuccess && payablesResult.data
                ? payablesResult.data.items
                : [],
              assignorsResult.data.items,
            );
          }
        } else {
          console.warn('No assignors data available or request failed');
          this.totalAssignors = 0;
          this.assignorDistribution = [];
        }

        this.isLoading = false;
        this.cdr.detectChanges(); // Force UI update with new data
      },
      error: (error) => {
        console.error('Error loading dashboard data', error);
        this.isLoading = false;
        this.monthlyPayables = this.generateDummyMonthlyData();
        this.cdr.detectChanges(); // Force UI update even on error
      },
    });
  }

  private generateDummyMonthlyData(): { month: string; amount: number }[] {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    return monthNames.map((month) => ({
      month: `${month} 2025`,
      amount: 0,
    }));
  }

  private generateMonthlyData(payables: any[]): void {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentDate = new Date();
    const monthlyData: Map<string, number> = new Map();

    // Initialize last 6 months with zero values
    for (let i = 5; i >= 0; i--) {
      const month = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      const key = `${monthNames[month.getMonth()]} ${month.getFullYear()}`;
      monthlyData.set(key, 0);
    }

    // Populate with actual data
    payables.forEach((payable) => {
      if (!payable.emissionDate) {
        return; // Skip if no date available
      }

      try {
        const date = new Date(payable.emissionDate);
        const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

        if (monthlyData.has(key)) {
          const value = parseFloat(payable.value?.toString() || '0');
          monthlyData.set(key, monthlyData.get(key)! + value);
        }
      } catch (err) {
        console.error('Error processing payable date', payable, err);
      }
    });

    // Convert to array format for chart
    this.monthlyPayables = Array.from(monthlyData.entries()).map(
      ([month, amount]) => ({
        month,
        amount,
      }),
    );
  }

  private generateAssignorDistribution(
    payables: any[],
    assignors: any[],
  ): void {
    const assignorCounts: Map<string, number> = new Map();
    const assignorMap: Map<string, string> = new Map();

    assignors.forEach((assignor) => {
      if (assignor && assignor.id) {
        assignorMap.set(assignor.id, assignor.name || 'Unnamed');
        assignorCounts.set(assignor.id, 0);
      }
    });

    // Count payables per assignor
    payables.forEach((payable) => {
      if (
        payable &&
        payable.assignorId &&
        assignorCounts.has(payable.assignorId)
      ) {
        assignorCounts.set(
          payable.assignorId,
          assignorCounts.get(payable.assignorId)! + 1,
        );
      }
    });

    // Convert to array format for chart, taking top 5 assignors
    this.assignorDistribution = Array.from(assignorCounts.entries())
      .map(([id, count]) => ({
        name: assignorMap.get(id) || 'Unknown',
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  openDialog() {
    const dialogRef = this.dialog.open(PayablesComponent, {
      width: '1200px',
      maxWidth: '90vw',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.loadDashboardData();
      }
    });
  }
}
