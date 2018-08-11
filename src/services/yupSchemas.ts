import * as yup from 'yup';

export const emailValidation = yup
  .string()
  .min(3)
  .max(255)
  .email('Invalid email');

export const passwordValidation = yup
  .string()
  .min(8, 'Password must be longer than 8 characters')
  .max(255);
