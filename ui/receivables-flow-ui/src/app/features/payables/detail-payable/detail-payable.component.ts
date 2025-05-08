import { Component, Inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdatePayableComponent } from '../update-payable/update-payable.component';
import { PayableService } from '../../core/data/http/payable/payable.service';
import { Assignor } from '../../assignors/assignors.component';

interface Payable {
  id: string;
  value: number;
  emissionDate: Date;
  assignorId: string;
  assignor: Assignor | null;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-detail-payable',
  imports: [SharedModule],
  templateUrl: './detail-payable.component.html',
  styleUrl: './detail-payable.component.scss',
})
export class DetailPayableComponent implements OnInit {
  isLoading = signal(true);

  constructor(
    @Inject(MAT_DIALOG_DATA) public payable: Payable,
    private dialogRef: MatDialogRef<UpdatePayableComponent>,
    private assignorService: PayableService,
  ) {}

  ngOnInit(): void {
    if (this.payable) {
      debugger;
      this.isLoading.set(false);
    }
  }
}
