/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

import { registerUser as apiRegisterUser, requestOTP, verifyOTP } from "@/utils/api/api.signup";

import {
    SignUpFormValues,
    signUpValidationSchema,
} from "@/utils/auth/SignUpValidation";

import {
    Mail,
    Lock,
    User,
    ArrowRight,
    CheckCircle2,
    Timer,
    LogIn,
} from "lucide-react";
import { SiNextdotjs } from "react-icons/si";
import { Inter } from "next/font/google";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { errorMessages } from "./SignInPage";

export default function SignUpPage() {
    const [step, setStep] = useState<"form" | "otp" | "success">("form");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState({
        request: false,
        verify: false,
        register: false,
    });
    const [otpError, setOtpError] = useState(false);
    const inputsRef = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const otpExpired = timer === 0;

    // Timer
    useEffect(() => {
        if (timer > 0) {
            const id = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(id);
        }
    }, [timer]);

    // Formik
    const formik = useFormik<SignUpFormValues>({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: signUpValidationSchema,
        onSubmit: async (values) => {
            setLoading((l) => ({ ...l, request: true }));
            try {
                setEmail(values.email);
                const { otpExpiresAt } = await requestOTP({ email: values.email, name: values.name });
                toast.success("OTP sent to your inbox");
                setStep("otp");
                setTimer(Math.max(0, Math.floor((new Date(otpExpiresAt).getTime() - Date.now()) / 1000)));
            } catch (err) {
                let message = "Failed to send OTP";

                // Check if the error is an AxiosError
                if (err instanceof AxiosError) {
                    message = err.response?.data?.message || message;
                } else if (err instanceof Error) {
                    message = err.message; // fallback for generic errors
                }

                toast.error(message);
            } finally {
                setLoading((l) => ({ ...l, request: false }));
            }
        },
    });

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value.replace(/[^0-9]/g, ""); // allow only digits
        const next = otp.split("");

        next[idx] = val[0] || ""; // set digit or empty
        const newOtp = next.join("");
        setOtp(newOtp);

        // Move focus forward if a digit was entered
        if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace") {
            if (!otp[idx] && idx > 0) {
                // Move focus to previous input if current is empty
                inputsRef.current[idx - 1]?.focus();
                const next = otp.split("");
                next[idx - 1] = ""; // optionally clear previous box
                setOtp(next.join(""));
            }
        }
    };


    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setOtpError(true);
            setTimeout(() => setOtpError(false), 500);
            return toast.error("Enter a 6-digit OTP");
        }
        setLoading((l) => ({ ...l, verify: true }));
        try {
            await verifyOTP({ email, otp });
            toast.success("OTP verified! Creating account...");
            await apiRegisterUser({
                name: formik.values.name,
                email,
                password: formik.values.password,
            });
            const res = await signIn("credentials", {
                email: email,
                password: formik.values.password,
                remember: true,
                callbackUrl: "/dashboard",
                redirect: false,
            });
            if (res?.error) {
                const msg = res.error ?? errorMessages[res.error] ?? errorMessages.default;
                toast.warning(msg);
            } else {
                toast.success("Welcome back!");
                window.location.href = '/dashboard';
            }
            setStep("success");
        } catch (err) {
            console.log("Failed to verify the OTP: ", err);
            let message = "Failed to send OTP";

            // Check if the error is an AxiosError
            if (err instanceof AxiosError) {
                message = err.response?.data?.message || message;
            } else if (err instanceof Error) {
                message = err.message; // fallback for generic errors
            }

            toast.error(message);
        } finally {
            setLoading((l) => ({ ...l, verify: false }));
        }
    };

    const formatTime = (secs: number) => {
        const m = String(Math.floor(secs / 60)).padStart(2, "0");
        const s = String(secs % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    return (
        <div className={`${inter.variable} font-sans flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="bg-white dark:bg-gray-800 shadow-lg border border-indigo-200 dark:border-gray-700 rounded-2xl">
                    <CardHeader className="text-center space-y-1 pb-3">
                        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            <SiNextdotjs size={28} /> NextLearn
                        </div>
                        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            {step === "form" && "Create Account"}
                            {step === "otp" && "Verify OTP"}
                            {step === "success" && "Success!"}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {step === "form" && (
                            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
                                {/* Name */}
                                <div>
                                    <Label
                                        htmlFor="name"
                                        className={`block text-sm font-medium transition-colors duration-200 ${formik.touched.name && formik.errors.name
                                            ? "text-red-500"
                                            : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {formik.touched.name && formik.errors.name ? formik.errors.name : "Name"}
                                    </Label>
                                    <div className="relative mt-1">
                                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <Input
                                            id="name"
                                            name="name"
                                            className={`pl-10 rounded-xl border ${formik.touched.name && formik.errors.name
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                                                } placeholder:text-gray-400`}
                                            value={formik.values.name || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <Label
                                        htmlFor="email"
                                        className={`block text-sm font-medium transition-colors duration-200 ${formik.touched.email && formik.errors.email
                                            ? "text-red-500"
                                            : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {formik.touched.email && formik.errors.email
                                            ? formik.errors.email
                                            : "Email"}
                                    </Label>
                                    <div className="relative mt-1">
                                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className={`pl-10 rounded-xl border ${formik.touched.email && formik.errors.email
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                                                } placeholder:text-gray-400`}
                                            value={formik.values.email || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <Label
                                        htmlFor="password"
                                        className={`block text-sm font-medium transition-colors duration-200 ${formik.touched.password && formik.errors.password
                                            ? "text-red-500"
                                            : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {formik.touched.password && formik.errors.password
                                            ? formik.errors.password
                                            : "Password"}
                                    </Label>
                                    <div className="relative mt-1">
                                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            className={`pl-10 rounded-xl border ${formik.touched.password && formik.errors.password
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                                                } placeholder:text-gray-400`}
                                            value={formik.values.password || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <Label
                                        htmlFor="confirmPassword"
                                        className={`block text-sm font-medium transition-colors duration-200 ${formik.touched.confirmPassword && formik.errors.confirmPassword
                                            ? "text-red-500"
                                            : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword
                                            ? formik.errors.confirmPassword
                                            : "Confirm Password"}
                                    </Label>
                                    <div className="relative mt-1">
                                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            className={`pl-10 rounded-xl border ${formik.touched.confirmPassword && formik.errors.confirmPassword
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                                                } placeholder:text-gray-400`}
                                            value={formik.values.confirmPassword || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between items-center gap-2 mt-1 text-sm">
                                    {/* Sign In */}
                                    <Link
                                        href="/signin"
                                        className="group relative inline-flex items-center font-medium 
               text-[color:var(--link-color)] dark:text-[color:var(--link-color-dark)]
               transition-colors duration-200 ease-out
               hover:text-[color:var(--link-hover)] dark:hover:text-[color:var(--link-hover-dark)]
               focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--link-focus)] focus-visible:rounded-lg"
                                        style={{
                                            // Smooth, harmonious blue blend
                                            "--link-color": "#3B5BDB",          // Muted indigo-blue base
                                            "--link-color-dark": "#7CA9FF",     // Softer for dark mode
                                            "--link-hover": "#2F4AB5",          // Slightly deeper hover
                                            "--link-hover-dark": "#96BAFF",
                                            "--link-focus": "#4F7FFF"
                                        } as React.CSSProperties}
                                    >
                                        <span className="pr-1 text-gray-600 dark:text-gray-300">Already have an account?</span>
                                        <span
                                            className="relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-[2px] 
                 after:bg-gradient-to-r after:from-[#4F7FFF] after:to-[#3B5BDB] after:transition-all after:duration-300 
                 group-hover:after:w-full"
                                        >
                                            Sign In
                                        </span>
                                    </Link>

                                    {/* Forgot Password */}
                                    <Link
                                        href="/reset"
                                        className="group relative inline-flex items-center font-medium
               text-[color:var(--reset-color)] dark:text-[color:var(--reset-color-dark)]
               transition-colors duration-200 ease-out
               hover:text-[color:var(--reset-hover)] dark:hover:text-[color:var(--reset-hover-dark)]
               focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--reset-focus)] focus-visible:rounded-lg"
                                        style={{
                                            // Warm, approachable accent
                                            "--reset-color": "#D94877",         // Muted rose
                                            "--reset-color-dark": "#FF99BB",    // Soft warm pink in dark mode
                                            "--reset-hover": "#B63C65",
                                            "--reset-hover-dark": "#FFB3CC",
                                            "--reset-focus": "#FF6FA3"
                                        } as React.CSSProperties}
                                    >
                                        <span
                                            className="relative after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:w-0 after:h-[2px] 
                 after:bg-gradient-to-r after:from-[#FF6FA3] after:to-[#D94877] after:transition-all after:duration-300 
                 group-hover:after:w-full"
                                        >
                                            Forgot Password?
                                        </span>
                                    </Link>
                                </div>


                                {/* Button */}
                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Button
                                        type="submit"
                                        className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
                                        disabled={loading.request}
                                    >
                                        {loading.request ? "Sending OTP…" : "Sign Up"}
                                        <ArrowRight size={18} />
                                    </Button>
                                </motion.div>
                            </form>
                        )}

                        {/* OTP Section */}
                        {step === "otp" && (
                            <>
                                <div className="flex justify-center gap-3 mb-5">
                                    {Array.from({ length: 6 }).map((_, idx) => (
                                        <motion.input
                                            key={idx}
                                            ref={(el: HTMLInputElement | null) => { inputsRef.current[idx] = el; }}
                                            type="text"
                                            maxLength={1}
                                            inputMode="numeric"
                                            value={otp[idx] || ""}
                                            onChange={(e) => handleOtpChange(e, idx)}
                                            onKeyDown={(e) => handleKeyDown(e, idx)}
                                            className={`w-12 h-12 text-center rounded-lg border font-semibold text-lg focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 ${otpError ? "border-red-500 animate-shake" : ""}`}
                                            whileFocus={{ scale: 1.1 }}
                                        />
                                    ))}
                                </div>

                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Button
                                        onClick={handleVerifyOTP}
                                        className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
                                        disabled={loading.verify || otpExpired} // <-- disable when expired
                                    >
                                        {loading.verify ? "Verifying…" : "Verify & Create Account"}
                                        <CheckCircle2 size={18} />
                                    </Button>
                                </motion.div>

                                <p className="text-sm text-center mt-4 text-gray-500 flex items-center justify-center gap-1">
                                    {otpExpired ? (
                                        <span className="text-red-500 font-semibold">
                                            OTP expired. <button className="underline cursor-pointer" onClick={async () => {
                                                setLoading((l) => ({ ...l, request: true }));
                                                try {
                                                    const { otpExpiresAt } = await requestOTP({ email, name: formik.values.name });
                                                    toast.success("OTP sent again!");
                                                    setTimer(Math.max(0, Math.floor((new Date(otpExpiresAt).getTime() - Date.now()) / 1000)));
                                                    setOtp(""); // reset OTP input
                                                } catch (err) {
                                                    toast.error("Failed to resend OTP");
                                                } finally {
                                                    setLoading((l) => ({ ...l, request: false }));
                                                }
                                            }}>Send again</button>
                                        </span>
                                    ) : (
                                        <>
                                            <span className="flex items-center gap-1">
                                                <Timer size={16} /> Expires in: <span className="font-mono">{formatTime(timer)}</span>
                                            </span>
                                        </>
                                    )}
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
