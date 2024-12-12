// src/app/services/user.service.ts
import { HttpClient } from '@angular/common/http';
import { SendOtpResponse, ValidateOtpResponse, RegisterUserResponse } from '../shared/response-model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://your-api-endpoint.com';

  constructor(private http: HttpClient) {}

  sendOtp(data: { email: string }): Observable<SendOtpResponse> {
    return this.http.post<SendOtpResponse>(`${this.apiUrl}/get/otp/sendOtp`, data);
  }

  validateOtp(data: { email: string; otp: string }): Observable<ValidateOtpResponse> {
    return this.http.post<ValidateOtpResponse>(`${this.apiUrl}/users/otp/validate`, data);
  }

  registerUser(data: any): Observable<RegisterUserResponse> {
    return this.http.post<RegisterUserResponse>(`${this.apiUrl}/users/register`, data);
  }
}
