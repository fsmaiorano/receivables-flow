import { Component, Inject, Optional } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-receivables',
  imports: [SharedModule],
  templateUrl: './receivables.component.html',
  styleUrl: './receivables.component.scss',
})
export class ReceivablesComponent {
  receivableForm: FormGroup;
  constructor(
    @Optional() public dialogRef: MatDialogRef<ReceivablesComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fromBuilder: FormBuilder,
  ) {
    this.receivableForm = this.fromBuilder.group({
      receivableId: [data?.receivableId],
      customerName: [data?.customerName],
      amount: [data?.amount],
      dueDate: [data?.dueDate],
      status: [data?.status],
    });
  }

  onNoClick(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
