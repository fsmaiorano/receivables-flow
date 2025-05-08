import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { PayableService } from '../core/data/http/payable/payable.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UpdatePayableComponent } from './update-payable/update-payable.component';
import { CreatePayableComponent } from './create-payable/create-payable.component';
import { PaginatedResponseDto } from '../core/dto/pagination.response';
import { Result } from '../core/dto/result.generic';
import { PayableResponse } from '../core/data/http/payable/dto/payable.response';
import { DetailPayableComponent } from './detail-payable/detail-payable.component';
import { UploadPayableComponent } from './upload-payable/upload-payable.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

interface Payable {
  id: string;
  value: number;
  emissionDate: Date;
  assignorId: string;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-payables',
  imports: [SharedModule, BreadcrumbComponent],
  templateUrl: './payables.component.html',
  styleUrl: './payables.component.scss',
  standalone: true,
})
export class PayablesComponent implements OnInit, AfterViewInit {
  payables = new MatTableDataSource<Payable>([]);
  displayedColumns: string[] = ['value', 'emissionDate', 'actions'];
  totalItems = 0;
  filterControl = new FormControl('');
  currentFilter: string = '';

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageIndex = 0;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private payableService: PayableService,
  ) {}

  ngOnInit(): void {
    this.setupFilterListener();
    this.loadPayables();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.paginator.page.subscribe((event: PageEvent) => {
        console.log('Page event:', event);

        const pageSizeChanged = this.pageSize !== event.pageSize;

        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;

        if (pageSizeChanged && this.pageIndex !== 0) {
          console.log('Page size changed, resetting to first page');
          this.pageIndex = 0;
          this.paginator.pageIndex = 0;
        }

        this.loadPayables();
      });
    }
  }

  setupFilterListener() {
    this.filterControl.valueChanges
      .pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((value) => {
        this.currentFilter = value || '';
        this.pageIndex = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.loadPayables();
      });
  }

  clearFilter() {
    this.filterControl.setValue('');
  }

  loadPayables() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    const currentPage = this.pageIndex + 1;
    const filter = this.currentFilter;

    console.log(
      `Loading payables: page=${currentPage}, size=${this.pageSize}, filter=${filter || 'none'}`,
    );

    this.payableService
      .getPayables(currentPage, this.pageSize, filter)
      .subscribe({
        next: (response: Result<PaginatedResponseDto<PayableResponse>>) => {
          if (response.isSuccess && response.data) {
            this.payables.data = response.data.items;
            this.totalItems = response.data.meta.totalItems;

            console.log(
              `Loaded ${response.data.items.length} payables. Total: ${this.totalItems}`,
            );

            if (this.paginator) {
              this.paginator.length = this.totalItems;
              this.paginator.pageIndex = this.pageIndex;
              this.paginator.pageSize = this.pageSize;
            }
          } else {
            console.error('Failed to load payables:', response.error);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading payables', error);
          this.isLoading = false;
        },
      });
  }

  deletePayable(id: string) {
    if (confirm('Are you sure you want to delete this payable?')) {
      this.payableService.deletePayable(id).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.loadPayables();
          } else {
            console.error('Failed to delete payable:', response.error);
          }
        },
        error: (error) => {
          console.error('Error deleting payable', error);
        },
      });
    }
  }

  openCreatePayableDialog() {
    const dialogRef = this.dialog.open(CreatePayableComponent, {
      width: '500px',
      maxWidth: '90vw',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.pageIndex = 0;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.loadPayables();
      }
    });
  }

  openEditPayableDialog(payable: Payable) {
    const dialogRef = this.dialog.open(UpdatePayableComponent, {
      width: '500px',
      maxWidth: '90vw',
      autoFocus: false,
      data: payable,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPayables();
      }
    });
  }

  openDetailPayableDialog(payable: Payable) {
    const dialogRef = this.dialog.open(DetailPayableComponent, {
      width: '500px',
      maxWidth: '90vw',
      autoFocus: false,
      data: payable,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPayables();
      }
    });
  }

  openImportPayablesDialog() {
    const dialogRef = this.dialog.open(UploadPayableComponent, {
      width: '500px',
      maxWidth: '90vw',
      autoFocus: false,
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPayables();
      }
    });
  }
}
