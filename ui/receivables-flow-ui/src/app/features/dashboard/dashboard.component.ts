import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { PayablesComponent } from '../payables/payables.component';

@Component({
  selector: 'app-dashboard',
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly dialog = inject(MatDialog);
  openDialog() {
    const dialogRef = this.dialog.open(PayablesComponent, {
      width: '1200px',
      maxWidth: '90vw',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
