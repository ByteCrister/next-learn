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
                await requestOTP({ email: values.email, name: values.name });
                toast.success("OTP sent to your inbox");
                setStep("otp");
                setTimer(180);
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
        const val = e.target.value.replace(/[^0-9]/g, "");
        if (!val) return;
        const next = otp.split("");
        next[idx] = val[0];
        const newOtp = next.join("");
        setOtp(newOtp);
        if (idx < 5) inputsRef.current[idx + 1]?.focus();
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
                    <CardHeader className="text-center space-y-3 pb-6">
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
                                    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <Input
                                            id="name"
                                            name="name"
                                            className="pl-10 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
                                            value={formik.values.name || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    {formik.touched.name && formik.errors.name && (
                                        <p className="text-sm text-red-500 mt-1">{formik.errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className="pl-10 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
                                            value={formik.values.email || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            className="pl-10 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
                                            value={formik.values.password || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {formik.touched.password && formik.errors.password && (
                                        <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            className="pl-10 rounded-xl border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
                                            value={formik.values.confirmPassword || ""}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <p className="text-sm text-red-500 mt-1">{formik.errors.confirmPassword}</p>
                                    )}
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
                                            className={`w-12 h-12 text-center rounded-lg border font-semibold text-lg focus:ring-2 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 ${otpError ? "border-red-500 animate-shake" : ""}`}
                                            whileFocus={{ scale: 1.1 }}
                                        />
                                    ))}
                                </div>

                                <motion.div whileHover={{ scale: 1.02 }}>
                                    <Button
                                        onClick={handleVerifyOTP}
                                        className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md"
                                        disabled={loading.verify}
                                    >
                                        {loading.verify ? "Verifying…" : "Verify & Create Account"}
                                        <CheckCircle2 size={18} />
                                    </Button>
                                </motion.div>

                                <p className="text-sm text-center mt-4 text-gray-500 flex items-center justify-center gap-1">
                                    <Timer size={16} /> Expires in:{" "}
                                    <span className="font-mono">{formatTime(timer)}</span>
                                </p>
                            </>
                        )}

                        {/* Success Section */}
                        {step === "success" && (
                            <div className="flex flex-col items-center gap-5">
                                <CheckCircle2 className="text-green-600" size={48} />
                                <p className="text-green-600 font-semibold text-lg">Account created successfully!</p>
                                <Link href="/signin">
                                    <Button className="rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold flex items-center gap-2 shadow-md">
                                        <LogIn size={18} /> Go to Sign In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
