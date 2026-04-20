import type { Role } from './auth';

export interface LoginFormInput {
  identifier: string;
  password: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormInput, string>>;

export interface SignupFormInput {
  fullName: string;
  email: string;
  phone: string;
  zone: string;
  profession: string;
  password: string;
  confirmPassword: string;
  role: Extract<Role, 'volunteer' | 'field'>;
}

export type SignupFormErrors = Partial<Record<keyof SignupFormInput, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[A-Za-z0-9._-]{3,30}$/;
const phoneRegex = /^\+?[1-9]\d{9,14}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export function validateLoginForm(input: LoginFormInput): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const identifier = input.identifier.trim();

  if (!identifier) {
    errors.identifier = 'Email or username is required.';
  } else if (identifier.includes('@') && !emailRegex.test(identifier)) {
    errors.identifier = 'Enter a valid email address.';
  } else if (!identifier.includes('@') && !usernameRegex.test(identifier)) {
    errors.identifier = 'Username must be 3-30 characters and can include letters, numbers, dot, underscore, or hyphen.';
  }

  if (!input.password) {
    errors.password = 'Password is required.';
  } else if (input.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  return errors;
}

export function validateSignupForm(
  input: SignupFormInput,
  allowedZones: string[],
  allowedProfessions: string[]
): SignupFormErrors {
  const errors: SignupFormErrors = {};
  const fullName = input.fullName.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();

  if (!fullName) {
    errors.fullName = 'Full name is required.';
  } else if (fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!phone) {
    errors.phone = 'Contact number is required.';
  } else if (!phoneRegex.test(phone)) {
    errors.phone = 'Enter a valid phone number with country code (e.g. +919876543210).';
  }

  if (!allowedZones.includes(input.zone)) {
    errors.zone = 'Select a valid operational zone.';
  }

  if (input.role === 'volunteer') {
    if (!input.profession) {
      errors.profession = 'Area of expertise is required for volunteers.';
    } else if (!allowedProfessions.includes(input.profession)) {
      errors.profession = 'Select a valid area of expertise.';
    }
  }

  if (!input.password) {
    errors.password = 'Password is required.';
  } else if (!passwordRegex.test(input.password)) {
    errors.password = 'Password must be 8+ characters with uppercase, lowercase, number, and special character.';
  }

  if (!input.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (input.password !== input.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}
