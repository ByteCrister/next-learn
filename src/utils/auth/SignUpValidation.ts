// utils/auth/SignUpValidation.ts
import * as Yup from "yup";

export interface SignUpFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Tiny sample; replace with a maintained list
const DISPOSABLE_DOMAINS = new Set([
    "mailinator.com",
    "10minutemail.com",
    "guerrillamail.com",
    "tempmail.com",
    "yopmail.com",
]);

const ROLE_ACCOUNTS = new Set([
    "admin",
    "support",
    "info",
    "contact",
    "sales",
    "hr",
    "billing",
    "noreply",
]);

export const COMMON_DOMAIN_TYPO_SUGGESTIONS: Record<string, string> = {
    // Gmail
    "gamil.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gnail.com": "gmail.com",
    "gmaill.com": "gmail.com",
    "gmail.con": "gmail.com",
    "gmail.co": "gmail.com",
    "gmail.om": "gmail.com",
    "gmaik.com": "gmail.com",
    "gmaul.com": "gmail.com",
    "gmaol.com": "gmail.com",
    "gmailc.om": "gmail.com",

    // Yahoo
    "yaho.com": "yahoo.com",
    "yhoo.com": "yahoo.com",
    "yaho.co": "yahoo.com",
    "yahho.com": "yahoo.com",
    "yaoo.com": "yahoo.com",
    "yhoo.co": "yahoo.com",
    "yaho.con": "yahoo.com",
    "yaho.om": "yahoo.com",

    // Hotmail
    "hotnail.com": "hotmail.com",
    "hotmil.com": "hotmail.com",
    "hotmaill.com": "hotmail.com",
    "hotmial.com": "hotmail.com",
    "hotmal.com": "hotmail.com",
    "hotmai.com": "hotmail.com",
    "hotnail.con": "hotmail.com",

    // Outlook
    "outlok.com": "outlook.com",
    "outllok.com": "outlook.com",
    "outloook.com": "outlook.com",
    "outlok.co": "outlook.com",
    "outlouk.com": "outlook.com",
    "otulook.com": "outlook.com",
    "oulook.com": "outlook.com",

    // iCloud
    "icoud.com": "icloud.com",
    "iclod.com": "icloud.com",
    "icluod.com": "icloud.com",
    "iclooud.com": "icloud.com",
    "icloid.com": "icloud.com",

    // ProtonMail
    "protonmale.com": "protonmail.com",
    "protonmaill.com": "protonmail.com",
    "protonmaol.com": "protonmail.com",
    "protonmil.com": "protonmail.com",

    // Zoho
    "zohoo.com": "zoho.com",
    "zhoo.com": "zoho.com",
    "zoho.co": "zoho.com",
    "zohoo.co": "zoho.com",

    // Generic TLD mistakes
    "gmail.cmo": "gmail.com",
    "yahoo.cmo": "yahoo.com",
    "hotmail.cmo": "hotmail.com",
    "outlook.cmo": "outlook.com",
    "icloud.cmo": "icloud.com",
};


const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/;

function splitEmail(v?: string) {
    if (!v || !v.includes("@")) return { local: "", domain: "" };
    const [local, ...rest] = v.split("@");
    return { local, domain: rest.join("@") };
}

export const signUpValidationSchema = Yup.object({
    // Name: required, min 2, max 50, letters and spaces only
    name: Yup.string()
        .trim()
        .required("Name is required")
        .matches(
            /^[A-Za-z\s]+$/,
            "Name can only contain letters and spaces"
        )
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),
    email: Yup.string()
        .trim()
        .transform((v) => v?.normalize("NFC"))
        .email("Invalid email")
        .test("no-invisible", "Email contains invalid characters", (v) => {
            if (!v) return false;
            return !ZERO_WIDTH.test(v);
        })
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email")
        .test("local-part", "Unusual email (invalid dots in local-part)", (v) => {
            if (!v) return false;
            const { local } = splitEmail(v);
            if (!local) return false;
            if (local.startsWith(".") || local.endsWith(".")) return false;
            if (/\.\./.test(local)) return false;
            return true;
        })
        .test("disposable", "Disposable email domains are not allowed", (v) => {
            if (!v) return false;
            const { domain } = splitEmail(v.toLowerCase());
            return !!domain && !DISPOSABLE_DOMAINS.has(domain);
        })
        .test("role-based", "Please use a personal email address", (v) => {
            if (!v) return true;
            const { local } = splitEmail(v.toLowerCase());
            return !ROLE_ACCOUNTS.has(local);
        })
        .test("typo-suggest", function (v) {
            if (!v) return false;
            const { local, domain } = splitEmail(v.toLowerCase());
            const suggestion = COMMON_DOMAIN_TYPO_SUGGESTIONS[domain];
            if (suggestion) {
                return this.createError({
                    message: `Did you mean ${local}@${suggestion}?`,
                });
            }
            return true;
        })
        .required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "At least 6 characters")
        .matches(/[A-Z]/, "At least one uppercase letter required")
        .matches(/[a-z]/, "At least one lowercase letter required")
        .matches(/\d/, "At least one number required")
        .matches(/[^A-Za-z0-9]/, "At least one special character required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
});
