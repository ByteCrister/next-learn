"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Formik, FormikHelpers } from "formik";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MdEmail, MdLock } from "react-icons/md"
import { RiUserSettingsLine } from "react-icons/ri"
import { SiNextdotjs } from "react-icons/si"
import { Inter } from "next/font/google"  // Google Font
import { FaSignInAlt } from "react-icons/fa" // Sign In icon
import {
  SignInFormValues,
  signInValidationSchema,
} from "@/utils/auth/SignInValidation";
import api from "@/utils/api/api.client";
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "700"] })
export const errorMessages: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  MissingCredentials: "Please provide both email and password.",
  UserNotFound: "No user found with this email.",
  PasswordMismatch: "Password does not match.",
  NoPasswordSet: "Reset your password then try to sing-in.",
  OAuthSignin: "Error in OAuth sign in.",
  default: "Something went wrong. Please try again.",
};

export default function SignInPage() {
  const params = useSearchParams();
  const oauthError = params.get("error");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (oauthError) {
      const msg = errorMessages[oauthError] ?? errorMessages.default;
      toast.error(msg);
    }
  }, [oauthError]);

  // In your sign-in page
  const handleSubmit = async (
    values: SignInFormValues,
    formikHelpers: FormikHelpers<SignInFormValues>
  ) => {
    formikHelpers.setSubmitting(true);

    const res = await api.post("/auth/signin-custom", {
      email: values.email,
      password: values.password,
    });

    if (!res.data.ok) {
      toast.error(errorMessages[res.data.error] ?? errorMessages.default);
    } else {
      // Don't redirect immediately - let the signIn handle it
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        remember: values.remember,
        redirect: false, // Don't redirect automatically
      });

      if (result?.error) {
        toast.error(errorMessages[result.error] ?? errorMessages.default);
      } else if (result?.ok) {
        // Manually redirect after successful sign-in
        window.location.href = "/dashboard";
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const result = await signIn("google", { callbackUrl: "/dashboard", redirect: false });
    if (result?.error) {
      toast.error(errorMessages[result.error] ?? errorMessages.default);
      setIsGoogleLoading(false);
    } else if (result?.url) {
      window.location.href = result.url;
    } else {
      // This should not happen, but if it does, stop loading.
      setIsGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex min-h-screen items-center justify-center 
    bg-gradient-to-br from-blue-100 to-indigo-50 
    dark:from-gray-950 dark:to-gray-900 
    p-4 sm:p-6 md:p-8 transition-colors duration-500 ${inter.className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-lg border border-indigo-200 dark:border-gray-700 rounded-2xl">

          {/* Header */}
          <CardHeader className="pb-4 text-center">
            <CardTitle
              className="flex items-center justify-center gap-2 text-3xl font-bold 
                     bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text 
                     text-transparent tracking-tight"
            >
              <SiNextdotjs className="text-indigo-500 dark:text-indigo-400" size={30} />
              NextLearn
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account with email or Google
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0 space-y-6">
            {/* Formik Form */}
            <Formik
              initialValues={{ email: "", password: "", remember: false }}
              validationSchema={signInValidationSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <MdEmail className="text-indigo-500" size={18} />
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {touched.email && errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="password"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      <MdLock className="text-indigo-500" size={18} />
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {touched.password && errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      name="remember"
                      variant="professionalBlue"
                      checked={values.remember}
                      onCheckedChange={(checked) => setFieldValue("remember", checked)}
                    />
                    <label
                      htmlFor="remember"
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 select-none"
                    >
                      <RiUserSettingsLine className="text-indigo-500" size={18} />
                      Remember me
                    </label>
                  </div>

                  {/* Sign In Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center py-3 
                             bg-gradient-to-r from-indigo-600 to-blue-500 
                             hover:from-indigo-700 hover:to-blue-600 
                             text-white font-medium shadow-lg hover:shadow-xl
                             dark:from-indigo-500 dark:to-blue-400 transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {!isSubmitting && <FaSignInAlt className="mr-2 h-5 w-5" />}
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </motion.div>
                </form>
              )}
            </Formik>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              <span className="mx-4 text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
                or continue with
              </span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            {/* Google Sign In */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-3
                       border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-gray-800 hover:bg-gray-50 
                       dark:hover:bg-gray-700 transition"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <span className="mr-2 h-5 w-5">
                    {/* Google Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" fill="none">
                      <path fill="#4285F4" d="M533.5 278.4c0-17.8-1.6-35-4.7-51.7H272v97.9h146.9c-6.4 34.6-25.9 63.9-55.4 83.5v69.2h89.6c52.4-48.3 82.4-119.4 82.4-198.9z" />
                      <path fill="#34A853" d="M272 544.3c74.1 0 136.2-24.5 181.6-66.5l-89.6-69.2c-24.8 16.7-56.5 26.4-92 26.4-70.8 0-130.8-47.8-152.4-112.2H28.5v70.6C73.7 484.9 167.5 544.3 272 544.3z" />
                      <path fill="#FBBC05" d="M119.6 321.8c-5.6-16.7-8.8-34.6-8.8-53s3.2-36.3 8.8-53v-70.6H28.5C10.2 199 0 238.2 0 278.4c0 40.2 10.2 79.4 28.5 111.8l91.1-68.4z" />
                      <path fill="#EA4335" d="M272 107.7c39.9 0 75.8 13.7 104.1 40.6l78.1-78.1C404.6 24.7 343.1 0 272 0 167.5 0 73.7 59.4 28.5 149.8l91.1 70.6c21.6-64.4 81.6-112.7 152.4-112.7z" />
                    </svg>
                  </span>
                )}
                <span>SignIn or Create new account</span>
              </Button>
            </motion.div>

            {/* Links */}
            <div className="space-y-2 text-center text-sm">
              <p className="text-gray-500 dark:text-gray-400">
                Forgot Password?{" "}
                <Link
                  href="/reset-password"
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Reset
                </Link>
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>

  );
}
