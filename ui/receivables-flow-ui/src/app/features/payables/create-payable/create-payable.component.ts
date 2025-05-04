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
import { AssignorService } from '../../core/data/http/assignor/assignor.service';
import { Observable, map, startWith } from 'rxjs';
import { AssignorResponse } from '../../core/data/http/assignor/dto/assignors.response';

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

  assignors: AssignorResponse[] = [];
  filteredAssignors: Observable<AssignorResponse[]> = new Observable();

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreatePayableComponent>,
    private payableService: PayableService,
    private assignorService: AssignorService,
    private snackBar: MatSnackBar,
  ) {
    this.payableForm = this.formBuilder.group({
      value: [null, [Validators.required, Validators.min(0.01)]],
      emissionDate: [new Date(), [Validators.required]],
      assignorId: ['', [Validators.required]],
      assignorName: ['', []],
    });
  }

  ngOnInit(): void {
    this.loadAssignors();

    this.filteredAssignors = this.payableForm
      .get('assignorName')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterAssignors(value || '')),
      );
  }

  loadAssignors(): void {
    this.assignorService.getAssignors(1, 100).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.assignors = response.data.items;
        } else {
          this.snackBar.open('Failed to load assignors', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }
      },
      error: (error) => {
        console.error('Error loading assignors', error);
        this.snackBar.open('Failed to load assignors', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  private _filterAssignors(value: string): AssignorResponse[] {
    const filterValue = value.toLowerCase();
    return this.assignors.filter((assignor) =>
      assignor.name.toLowerCase().includes(filterValue),
    );
  }

  onAssignorSelected(event: any): void {
    const assignor = event.option.value;
    this.payableForm.patchValue({
      assignorId: assignor.id,
      assignorName: assignor.name,
    });
  }

  displayAssignor(assignor: AssignorResponse): string {
    return assignor ? assignor.name : '';
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

    if (this.payableForm.valid) {
      this.loading = true;

      const formData = { ...this.payableForm.value };
      delete formData.assignorName;

      this.payableService.createPayable(formData).subscribe({
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
