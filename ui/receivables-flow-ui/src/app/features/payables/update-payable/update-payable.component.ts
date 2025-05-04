import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PayableService } from '../../core/data/http/payable/payable.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Payable {
  id: string;
  value: number;
  emissionDate: Date;
  assignorId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-update-payable',
  imports: [SharedModule],
  templateUrl: './update-payable.component.html',
  styleUrl: './update-payable.component.scss',
  standalone: true,
})
export class UpdatePayableComponent implements OnInit {
  payableForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Payable,
    private dialogRef: MatDialogRef<UpdatePayableComponent>,
    private payableService: PayableService,
    private snackBar: MatSnackBar,
  ) {
    this.payableForm = this.formBuilder.group({
      value: [null, [Validators.required, Validators.min(0.01)]],
      emissionDate: [null, [Validators.required]],
      assignorId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.payableForm.patchValue({
        value: this.data.value,
        emissionDate: new Date(this.data.emissionDate),
        assignorId: this.data.assignorId,
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.payableForm.controls;
  }

  getErrorMessage(controlName: string): string {
    const control = this.f[controlName];

    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }

    if (control.errors['min']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['min'].min}`;
    }

    return '';
  }

  onSubmit(): void {
    this.submitted = true;

    Object.keys(this.f).forEach((field) => {
      const control = this.payableForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    if (this.payableForm.valid && this.data?.id) {
      this.loading = true;

      this.payableService
        .updatePayable(this.data.id, this.payableForm.value)
        .subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.snackBar.open('Payable updated successfully', 'Close', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['success-snackbar'],
              });
              this.dialogRef.close(true);
            } else {
              this.snackBar.open(`Error: ${response.error}`, 'Close', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              });
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating payable', error);
            this.snackBar.open('Failed to update payable', 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
            this.loading = false;
          },
        });
    } else {
      this.snackBar.open('Please fix the validation errors', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar'],
      });
    }
  }
}
