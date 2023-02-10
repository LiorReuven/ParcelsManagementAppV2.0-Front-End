import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  username: string = '';
  password: string = '';
  isSubmitting: boolean = false;
  error: string = '';
  loginForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [],
      }),
      password: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [],
      }),
    });
  }

  onSubmit(): void {
    if (!this.loginForm) {
      return;
    }
    this.isSubmitting = true;
    this.username = this.loginForm.value.username;
    this.password = this.loginForm.value.password;
    this.authService
      .login(this.username.trim(), this.password.trim())
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.router.navigate(['/parcels-management']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.loginForm.reset();
          if (err.error.message) {
            this.error = err.error.message;
          } else {
            this.error = "Unknown server error"
          }
        },
      });
  }
}
