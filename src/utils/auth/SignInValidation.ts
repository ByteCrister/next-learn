import * as Yup from "yup";
import validator from "validator";


// Expanded list of known disposable / temporary email domains
const disposableDomains = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "fakeinbox.com",
  "maildrop.cc",
  "dispostable.com",
  "throwawaymail.com",
  "sharklasers.com",
  "spamgourmet.com",
  "mohmal.com",
  "burnermail.io",
  "relay.firefox.com", // Firefox Relay
  "anonaddy.me",       // AnonAddy
  "mailnesia.com",
  "inboxbear.com",
  "temporary-mail.net",
];

// Expanded list of common role-based / generic user prefixes
const roleBasedUsers = [
  "admin",
  "administrator",
  "root",
  "support",
  "info",
  "contact",
  "help",
  "helpdesk",
  "noreply",
  "no-reply",
  "do-not-reply",
  "sales",
  "marketing",
  "hr",
  "careers",
  "jobs",
  "team",
  "security",
  "abuse",
  "postmaster",
  "webmaster",
  "hostmaster",
  "billing",
  "accounting",
  "payments",
];


/**
 * Validation schema for Sign In
 * - Email: strict format validation using `validator.isEmail`
 * - Password: strong rules (uppercase, lowercase, number, special char)
 * - Remember: defaults to false
 */
export const signInValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .max(254, "Email must be 254 characters or fewer")
    .required("Email is required")
    // Syntax validation
    .test("is-valid-email", "Invalid email address", (value) =>
      value ? validator.isEmail(value, { allow_utf8_local_part: false, require_tld: true }) : false
    )
    // Disposable email block
    .test("no-disposable", "Disposable email addresses are not allowed", (value) => {
      if (!value) return false;
      const domain = value.split("@")[1];
      return domain ? !disposableDomains.includes(domain) : false;
    })
    // Role-based email block
    .test("no-role-based", "Role-based emails are not allowed", (value) => {
      if (!value) return false;
      const localPart = value.split("@")[0];
      return localPart ? !roleBasedUsers.includes(localPart) : false;
    }),

  password: Yup.string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[0-9]/, "Must include a number")
    .matches(/[^A-Za-z0-9]/, "Must include a special character")
    .required("Password is required"),

  remember: Yup.boolean().default(false),
});

/**
 * Inferred TypeScript type from schema
 * Keeps schema & types in sync automatically
 */
export type SignInFormValues = Yup.InferType<typeof signInValidationSchema>;
