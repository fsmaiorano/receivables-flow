import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-update-assignor',
  imports: [SharedModule],
  templateUrl: './update-assignor.component.html',
  styleUrl: './update-assignor.component.scss',
})
export class UpdateAssignorComponent {
  assignorForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.assignorForm = this.formBuilder.group({
      name: [''],
      email: [''],
      document: [''],
      phone: [''],
    });
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }
}
