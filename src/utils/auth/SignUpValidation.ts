// emailValidation.ts
import * as Yup from "yup";

export interface SignUpFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Tiny sample; replace with a maintained, regularly updated list.
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

const COMMON_DOMAIN_TYPO_SUGGESTIONS: Record<string, string> = {
    "gamil.com": "gmail.com",
    "gmial.com": "gmail.com",
    "gnail.com": "gmail.com",
    "hotnail.com": "hotmail.com",
    "yaho.com": "yahoo.com",
    "outlok.com": "outlook.com",
};

const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/;

function splitEmail(v?: string) {
    if (!v || !v.includes("@")) return { local: "", domain: "" };
    const [local, ...rest] = v.split("@");
    return { local, domain: rest.join("@") }; // preserve rare, valid cases
}

export const signUpValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .trim()
        .transform((v) => v?.normalize("NFC"))
        .email("Invalid email")
        // Prevent invisible characters that spoof addresses
        .test("no-invisible", "Email contains invalid characters", (v) => {
            if (!v) return false;
            return !ZERO_WIDTH.test(v);
        })
        // Enforce simple TLD presence and forbid spaces
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email")
        // Local-part sanity checks
        .test("local-part", "Unusual email (invalid dots in local-part)", (v) => {
            if (!v) return false;
            const { local } = splitEmail(v);
            if (!local) return false;
            if (local.startsWith(".") || local.endsWith(".")) return false;
            if (/\.\./.test(local)) return false;
            return true;
        })
        // Block disposable domains
        .test("disposable", "Disposable email domains are not allowed", (v) => {
            if (!v) return false;
            const { domain } = splitEmail(v.toLowerCase());
            return !!domain && !DISPOSABLE_DOMAINS.has(domain);
        })
        // Optionally block role-based inboxes (toggle based on your product)
        .test("role-based", "Please use a personal email address", (v) => {
            if (!v) return true; // make optional: return true to allow by default
            const { local } = splitEmail(v.toLowerCase());
            return !ROLE_ACCOUNTS.has(local);
        })
        // Suggest fix for common domain typos
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
        // Async MX lookup via your API route
        .test(
            "mx-record",
            "Email domain does not appear to accept mail",
            async function (v) {
                if (!v) return false;
                const { domain } = splitEmail(v.toLowerCase());
                if (!domain) return false;

                try {
                    const res = await fetch(
                        `/api/validate-email-domain?domain=${encodeURIComponent(domain)}`,
                        { method: "GET" }
                    );
                    if (!res.ok) return true; // don't hard-fail on network; defer to server on submit
                    const data = (await res.json()) as { acceptsMail: boolean };
                    if (!data.acceptsMail) {
                        return this.createError({
                            message: "Email domain is not reachable (no MX records).",
                        });
                    }
                } catch {
                    // Network issues: allow and re-validate server-side
                    return true;
                }
                return true;
            }
        )
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
