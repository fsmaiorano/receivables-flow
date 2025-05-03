import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AssignorService } from '../../core/data/http/assignor/assignor.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Assignor {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
}

@Component({
  selector: 'app-update-assignor',
  imports: [SharedModule],
  templateUrl: './update-assignor.component.html',
  styleUrl: './update-assignor.component.scss',
  standalone: true,
})
export class UpdateAssignorComponent implements OnInit {
  assignorForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Assignor,
    private dialogRef: MatDialogRef<UpdateAssignorComponent>,
    private assignorService: AssignorService,
    private snackBar: MatSnackBar,
  ) {
    this.assignorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      document: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.assignorForm.patchValue({
        name: this.data.name,
        email: this.data.email,
        document: this.data.document,
        phone: this.data.phone,
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.assignorForm.controls;
  }

  getErrorMessage(controlName: string): string {
    const control = this.f[controlName];

    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }

    if (control.errors['email'] || control.errors['pattern']) {
      return 'Please enter a valid email address';
    }

    if (control.errors['minlength']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }

    return '';
  }

  onSubmit(): void {
    this.submitted = true;

    Object.keys(this.f).forEach((field) => {
      const control = this.assignorForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    if (this.assignorForm.valid && this.data?.id) {
      this.loading = true;

      this.assignorService
        .updateAssignor(this.data.id, this.assignorForm.value)
        .subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.snackBar.open('Assignor updated successfully', 'Close', {
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
            console.error('Error updating assignor', error);
            this.snackBar.open('Failed to update assignor', 'Close', {
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
