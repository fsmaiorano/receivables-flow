import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { assignor: Assignor },
    private dialogRef: MatDialogRef<UpdateAssignorComponent>,
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

  ngOnInit(): void {
    // Pre-fill the form with existing assignor data
    if (this.data?.assignor) {
      this.assignorForm.patchValue({
        name: this.data.assignor.name,
        email: this.data.assignor.email,
        document: this.data.assignor.document,
        phone: this.data.assignor.phone,
      });
    }
  }

  onSubmit(): void {
    if (this.assignorForm.valid && this.data?.assignor?.id) {
      this.loading = true;

      this.assignorService
        .updateAssignor(this.data.assignor.id, this.assignorForm.value)
        .subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.snackBar.open('Assignor updated successfully', 'Close', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['success-snackbar'],
              });
              this.dialogRef.close(true); // Close with success result
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
    }
  }
}
