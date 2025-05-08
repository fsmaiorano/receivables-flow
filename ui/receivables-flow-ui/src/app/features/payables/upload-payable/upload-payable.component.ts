import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoreService } from '../../core/store/store.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-upload-payable',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './upload-payable.component.html',
  styleUrl: './upload-payable.component.scss',
})
export class UploadPayableComponent implements OnInit {
  uploadForm: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;
  isDragging = false;
  uploadProgress = 0;
  isUploaded = false;
  errorMessage = '';

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<UploadPayableComponent>,
    private snackBar: MatSnackBar,
    private storeService: StoreService,
  ) {
    this.uploadForm = this.fb.group({
      file: [''],
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.validateAndSetFile(file);
    }
  }

  validateAndSetFile(file: File) {
    if (file.name.toLowerCase().endsWith('.csv')) {
      this.selectedFile = file;
      this.uploadForm.get('file')?.setValue(file.name);
      this.errorMessage = '';
    } else {
      this.selectedFile = null;
      this.uploadForm.get('file')?.setValue('');
      this.errorMessage = 'Please select a CSV file.';
      this.snackBar.open('Only CSV files are allowed', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  browseFiles() {
    this.fileInput.nativeElement.click();
  }

  removeFile() {
    this.selectedFile = null;
    this.uploadForm.get('file')?.setValue('');
    this.isUploaded = false;
    this.uploadProgress = 0;
  }

  uploadFile() {
    if (!this.selectedFile) {
      this.snackBar.open('Please select a file first', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar'],
      });
      return;
    }

    this.isLoading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.storeService.getStore().token}`,
    });

    this.http
      .post('http://localhost:3333/integrations/payable/batch/csv', formData, {
        headers,
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: (event: any) => {
          if (event.type === 1) {
            if (event.total) {
              this.uploadProgress = Math.round(
                (100 * event.loaded) / event.total,
              );
            }
          } else if (event.type === 4) {
            // HttpEventType.Response
            this.isUploaded = true;
            this.uploadProgress = 100;
            this.snackBar.open('File uploaded successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            setTimeout(() => {
              this.dialogRef.close(true);
            }, 1500);
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.errorMessage =
            error.error?.message || 'An error occurred during upload';
          this.snackBar.open(this.errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }
}
