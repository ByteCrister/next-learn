import * as Yup from "yup";
export interface SignInFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export const signInValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Invalid email address")
    .max(254, "Email must be 254 characters or fewer")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[0-9]/, "Must include a number")
    .matches(/[^A-Za-z0-9]/, "Must include a special character")
    .required("Password is required"),

  remember: Yup.boolean().default(false),
});
