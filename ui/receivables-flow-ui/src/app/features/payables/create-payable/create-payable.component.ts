import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayableService } from '../../core/data/http/payable/payable.service';

@Component({
  selector: 'app-create-payable',
  imports: [SharedModule],
  templateUrl: './create-payable.component.html',
  styleUrl: './create-payable.component.scss',
  standalone: true,
})
export class CreatePayableComponent implements OnInit {
  payableForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreatePayableComponent>,
    private payableService: PayableService,
    private snackBar: MatSnackBar,
  ) {
    this.payableForm = this.formBuilder.group({
      value: [null, [Validators.required, Validators.min(0.01)]],
      emissionDate: [new Date(), [Validators.required]],
      assignorId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

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

    if (this.payableForm.valid) {
      this.loading = true;

      this.payableService.createPayable(this.payableForm.value).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.snackBar.open('Payable created successfully', 'Close', {
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
          console.error('Error when trying to create a new payable', error);
          this.snackBar.open('Failed to create payable', 'Close', {
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
