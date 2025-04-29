import { Component, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../core/data/http/user/user.service';
import { StoreService } from '../core/store/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [SharedModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  hide = signal(true);
  isLoading = signal(false);
  authFormGroup: FormGroup;
  constructor(
    private fromBuilder: FormBuilder,
    private userService: UserService,
    private store: StoreService,
    private router: Router,
  ) {
    this.authFormGroup = this.fromBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    this.isLoading.set(true);
    if (this.authFormGroup.invalid) {
      const email = this.authFormGroup.get('username')?.value;
      const password = this.authFormGroup.get('password')?.value;
      try {
        this.userService
          .authentication(email, password)
          .subscribe((response) => {
            debugger;
            sessionStorage.setItem('token', response.accessToken);
            sessionStorage.setItem('userId', response.userId);

            this.store.updateStore({
              userId: response.userId,
            });

            // this.router.navigate(['/dashboard']);
          });
      } catch (error) {
        console.error('Sign-in failed', error);
      } finally {
        this.isLoading.set(false);
      }
    }

    console.log('Form submitted successfully:', this.authFormGroup.value);
    debugger;
    this.authFormGroup.reset();
    this.isLoading.set(false);
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
