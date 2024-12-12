import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
// import { UserService } from '../services/user.service';  // Custom Service for HTTP requests
import { UserService } from '../../services/user.service';
import { RegisterUserResponse, ValidateOtpResponse } from '../../shared/response-model';
// import { PasswordValidator } from 'ngx-password-validator'; // Add this library for password validation

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  otp: string = '';
  message: string = '';
  error: string = '';
  userId: string = '';
  isLoading: boolean = false;
  showOtpSplash: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      lastName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      aadharId: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { 
      validator: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  handleChange(event: any) {
    const { name, value } = event.target;

    if (name === 'firstName' || name === 'lastName') {
      this.registerForm.patchValue({ [name]: this.capitalize(value) });
    } else if (name === 'phoneNumber') {
      this.registerForm.patchValue({ [name]: this.formatPhone(value) });
    } else if (name === 'aadharId') {
      this.registerForm.patchValue({ [name]: this.formatAadhar(value) });
    } else {
      this.registerForm.patchValue({ [name]: value });
    }
  }

  capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  formatPhone(value: string): string {
    return value.replace(/\D/g, '').slice(0, 10);
  }

  formatAadhar(value: string): string {
    return value.replace(/\D/g, '').replace(/(\d{4})(\d)/, '$1 $2').replace(/(\d{4}) (\d{4})(\d)/, '$1 $2 $3');
  }

  async handleSubmit() {
    if (this.registerForm.invalid) {
      this.error = 'Please fill in all required fields correctly.';
      return;
    }
  
    this.isLoading = true;
    this.error = '';
    this.message = '';
  
    const { email } = this.registerForm.value;
  
    this.userService.sendOtp({ email }).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showOtpSplash = true;
          this.message = 'OTP sent to your email.';
        } else {
          this.error = 'Failed to send OTP.';
        }
      },
      error: (err: any) => {
        this.error = 'Error sending OTP: ' + (err.error?.message || 'Unknown error');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  

  async handleOtpSubmit() {
    this.isLoading = true;
    this.error = '';
    this.message = '';
  
    this.userService.validateOtp({
      email: this.registerForm.value.email,
      otp: this.otp,
    }).subscribe({
      next: (otpResponse: ValidateOtpResponse) => {
        if (otpResponse.status === 200) {
          this.userService.registerUser({
            ...this.registerForm.value,
            aadharId: this.registerForm.value.aadharId.replace(/\s/g, ''),
            otp: this.otp,
          }).subscribe({
            next: (registrationResponse: RegisterUserResponse) => {
              if (registrationResponse.status === 201) {
                this.userId = registrationResponse.data.userId;
                this.message = 'User registered successfully.';
                this.router.navigate(['/login']);
              } else {
                this.error = 'Registration failed.';
              }
            },
            error: (err: any) => {
              this.error = 'Error registering user: ' + (err.error?.message || 'Unknown error');
            },
          });
        } else {
          this.error = 'OTP validation failed: ' + otpResponse.message;
        }
      },
      error: (err: any) => {
        this.error = 'Error validating OTP: ' + (err.error?.message || 'Unknown error');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  

  handleCopy() {
    navigator.clipboard.writeText(this.userId);
    this.message = 'User ID copied!';
  }
}
