import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatGridListModule,
    MatExpansionModule,
    MatTabsModule,
    MatRadioModule,
    MatSelectModule,
    MatDialogModule,
    MatSidenavModule,
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatGridListModule,
    MatExpansionModule,
    MatTabsModule,
    MatRadioModule,
    MatSelectModule,
    MatDialogModule,
    MatSidenavModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class SharedModule {}
