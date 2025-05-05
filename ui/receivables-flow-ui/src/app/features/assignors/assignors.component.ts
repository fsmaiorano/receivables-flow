import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { AssignorService } from '../core/data/http/assignor/assignor.service';
import { UpdateAssignorComponent } from './update-assignor/update-assignor.component';
import { CreateAssignorComponent } from './create-assignor/create-assignor.component';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AssignorResponse } from '../core/data/http/assignor/dto/assignors.response';
import { PaginatedResponseDto } from '../core/dto/pagination.response';
import { Result } from '../core/dto/result.generic';

interface Assignor {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
}

@Component({
  selector: 'app-assignors',
  imports: [SharedModule],
  templateUrl: './assignors.component.html',
  styleUrl: './assignors.component.scss',
})
export class AssignorsComponent implements OnInit, AfterViewInit {
  assignors = new MatTableDataSource<Assignor>([]);
  displayedColumns: string[] = ['name', 'email', 'actions'];
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
    private assignorService: AssignorService,
  ) {}

  ngOnInit(): void {
    this.setupFilterListener();
    this.loadAssignors();
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

        this.loadAssignors();
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
        this.loadAssignors();
      });
  }

  clearFilter() {
    this.filterControl.setValue('');
  }

  loadAssignors() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    const currentPage = this.pageIndex + 1;
    const filter = this.currentFilter;

    console.log(
      `Loading assignors: page=${currentPage}, size=${this.pageSize}, filter=${filter || 'none'}`,
    );

    this.assignorService
      .getAssignors(currentPage, this.pageSize, filter)
      .subscribe({
        next: (response: Result<PaginatedResponseDto<AssignorResponse>>) => {
          if (response.isSuccess && response.data) {
            this.assignors.data = response.data.items;
            this.totalItems = response.data.meta.totalItems;

            console.log(
              `Loaded ${response.data.items.length} assignors. Total: ${this.totalItems}`,
            );

            if (this.paginator) {
              this.paginator.length = this.totalItems;
              this.paginator.pageIndex = this.pageIndex;
              this.paginator.pageSize = this.pageSize;
            }
          } else {
            console.error('Failed to load assignors:', response.error);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading assignors', error);
          this.isLoading = false;
        },
      });
  }

  deleteAssignor(id: string) {
    if (confirm('Are you sure you want to delete this assignor?')) {
      this.assignorService.deleteAssignor(id).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.loadAssignors();
          } else {
            console.error('Failed to delete assignor:', response.error);
          }
        },
        error: (error) => {
          console.error('Error deleting assignor', error);
        },
      });
    }
  }

  openCreateAssignorDialog() {
    const dialogRef = this.dialog.open(CreateAssignorComponent, {
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
        this.loadAssignors();
      }
    });
  }

  openEditAssignorDialog(assignor: Assignor) {
    const dialogRef = this.dialog.open(UpdateAssignorComponent, {
      width: '500px',
      maxWidth: '90vw',
      autoFocus: false,
      data: assignor,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAssignors();
      }
    });
  }
}
