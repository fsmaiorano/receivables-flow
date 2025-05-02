import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { AssignorService } from '../core/data/http/assignor/assignor.service';
import { UpdateAssignorComponent } from './update-assignor/update-assignor.component';

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
    const pageIndex = this.paginator?.pageIndex ?? 1;
    const pageSize = this.paginator?.pageSize ?? 10;

    this.assignorService.getAssignors(pageIndex, pageSize).subscribe({
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

  deleteAssignor(arg0: any) {
    console.log('Delete assignor', arg0);
    throw new Error('Method not implemented.');
  }

  openCreateAssignorDialog() {
    // TODO: Implement dialog for creating assignors
    console.log('Open create assignor dialog');
  }

  openEditAssignorDialog(assignor: Assignor) {
    const dialogRef = this.dialog.open(UpdateAssignorComponent, {
      width: '1200px',
      maxWidth: '90vw',
      autoFocus: false,
      data: assignor,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
