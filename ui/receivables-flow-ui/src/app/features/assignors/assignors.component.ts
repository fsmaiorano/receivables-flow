import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from '../../shared/shared.module';
import { HttpClient } from '@angular/common/http';

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
  ) {}

  ngOnInit(): void {
    this.loadAssignors();
  }

  ngAfterViewInit() {
    this.assignors.paginator = this.paginator;
  }

  loadAssignors() {
    // Get the token from session storage
    const token = sessionStorage.getItem('token');

    // Add the token to the headers
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make the HTTP request
    // this.http
    //   .get<any>(`${environment.apiUrl}/assignor`, { headers })
    //   .subscribe({
    //     next: (response) => {
    //       this.assignors.data = response;
    //     },
    //     error: (error) => {
    //       console.error('Error loading assignors', error);
    //     },
    //   });
  }

  openCreateAssignorDialog() {
    // TODO: Implement dialog for creating assignors
    console.log('Open create assignor dialog');
  }

  openEditAssignorDialog(assignor: Assignor) {
    // TODO: Implement dialog for editing assignors
    console.log('Open edit assignor dialog', assignor);
  }

  deleteAssignor(id: string) {
    if (confirm('Are you sure you want to delete this assignor?')) {
      const token = sessionStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // this.http
      //   .delete(`${environment.apiUrl}/assignor/${id}`, { headers })
      //   .subscribe({
      //     next: () => {
      //       // Refresh the assignors list after deletion
      //       this.loadAssignors();
      //     },
      //     error: (error) => {
      //       console.error('Error deleting assignor', error);
      //     },
      //   });
    }
  }
}
