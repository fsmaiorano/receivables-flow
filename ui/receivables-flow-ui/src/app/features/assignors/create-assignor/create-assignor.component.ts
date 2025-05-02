import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignorService } from '../../core/data/http/assignor/assignor.service';

@Component({
  selector: 'app-create-assignor',
  imports: [SharedModule],
  templateUrl: './create-assignor.component.html',
  styleUrl: './create-assignor.component.scss',
})
export class CreateAssignorComponent {
  assignorForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateAssignorComponent>,
    private assignorService: AssignorService,
    private snackBar: MatSnackBar,
  ) {
    this.assignorForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      document: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
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
    }
  }
}
