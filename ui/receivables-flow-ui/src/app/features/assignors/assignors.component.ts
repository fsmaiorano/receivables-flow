import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { AssignorService } from '../core/data/http/assignor/assignor.service';
import { UpdateAssignorComponent } from './update-assignor/update-assignor.component';
import { CreateAssignorComponent } from './create-assignor/create-assignor.component';

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
export class AssignorsComponent implements OnInit {
  assignors = new MatTableDataSource<Assignor>([]);
  displayedColumns: string[] = ['name', 'email', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private assignorService: AssignorService,
  ) {}

  ngOnInit(): void {
    this.loadAssignors();
  }

  ngAfterViewInit() {
    this.assignors.paginator = this.paginator;
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.loadAssignors();
      });
    }
  }

  loadAssignors() {
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 10;

    this.assignorService.getAssignors(pageIndex + 1, pageSize).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.assignors.data = response.data.items;

          if (this.paginator) {
            this.paginator.length = response.data.meta.totalItems;
          }
        } else {
          console.error('Failed to load assignors:', response.error);
        }
      },
      error: (error) => {
        console.error('Error loading assignors', error);
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
