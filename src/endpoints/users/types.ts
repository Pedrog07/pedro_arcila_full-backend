export interface RegisterUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyEmailDTO {
  verificationCode: string;
  email: string;
}

export interface ResetPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
}
