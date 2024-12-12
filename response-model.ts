// src/app/shared/models/response-models.ts

export interface SendOtpResponse {
    status: number; // e.g., 200 for success
    message: string; // e.g., "OTP sent successfully"
  }
  
  export interface ValidateOtpResponse {
    status: number; // e.g., 200 for success
    message: string; // e.g., "OTP validated successfully"
  }
  
  export interface RegisterUserResponse {
    status: number; // e.g., 201 for created
    data: {
      userId: string; // e.g., the registered user's ID
    };
    message: string; // e.g., "User registered successfully"
  }
  