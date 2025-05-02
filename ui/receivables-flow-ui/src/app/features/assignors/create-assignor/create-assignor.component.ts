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
import { AssignorService } from '../../core/data/http/assignor/assignor.service';

@Component({
  selector: 'app-create-assignor',
  imports: [SharedModule],
  templateUrl: './create-assignor.component.html',
  styleUrl: './create-assignor.component.scss',
  standalone: true,
})
export class CreateAssignorComponent implements OnInit {
  assignorForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateAssignorComponent>,
    private assignorService: AssignorService,
    private snackBar: MatSnackBar,
  ) {
    this.assignorForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      document: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  // Getter for easy access to form fields
  get f(): { [key: string]: AbstractControl } {
    return this.assignorForm.controls;
  }

  // Get specific error messages for each field
  getErrorMessage(controlName: string): string {
    const control = this.f[controlName];

    if (control.errors?.['required']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }

    if (control.errors?.['email'] || control.errors?.['pattern']) {
      return 'Please enter a valid email address';
    }

    if (control.errors?.['minlength']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }

    return '';
  }

  onSubmit(): void {
    this.submitted = true;

    // Mark all fields as touched to trigger validation display
    Object.keys(this.f).forEach((field) => {
      const control = this.assignorForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    if (this.assignorForm.valid) {
      this.loading = true;

      this.assignorService.createAssignor(this.assignorForm.value).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.snackBar.open('Assignor created successfully', 'Close', {
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
          console.error('Error when try to create an new assignor', error);
          this.snackBar.open('Failed to create assignor', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
          this.loading = false;
        },
      });
    } else {
      // If form is invalid, show general validation error
      this.snackBar.open('Please fix the validation errors', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar'],
      });
    }
  }
}
