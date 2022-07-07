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
