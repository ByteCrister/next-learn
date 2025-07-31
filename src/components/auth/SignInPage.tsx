"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

import {
  SignInFormValues,
  signInValidationSchema,
} from "@/utils/auth/SignInValidation";

const errorMessages: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  OAuthSignin: "Error in OAuth sign in.",
  default: "Something went wrong. Please try again.",
};

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const oauthError = params.get("error");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (oauthError) {
      const msg = errorMessages[oauthError] ?? errorMessages.default;
      toast.error(msg);
    }
  }, [oauthError]);

  const handleSubmit = async (
    values: SignInFormValues,
    formikHelpers: FormikHelpers<SignInFormValues>
  ) => {
    formikHelpers.setSubmitting(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      remember: values.remember,
    });

    formikHelpers.setSubmitting(false);

    if (res?.error) {
      const msg = res.error ?? errorMessages[res.error] ?? errorMessages.default;
      toast.warning(msg);
    } else {
      toast.success("Welcome back!");
      router.push("/");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const res = await signIn("google", { callbackUrl: "/", redirect: false });
    if (res?.error) {
      toast.error(`Sign-in failed: ${res.error}`);
      setIsGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center 
             bg-gradient-to-br from-blue-100 to-indigo-50 
             dark:from-gray-950 dark:to-gray-900 
             p-6 sm:p-12 transition-colors duration-500"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Card className="w-full border border-gray-200 dark:border-gray-800 
                     bg-white dark:bg-gray-900 shadow-2xl 
                     rounded-3xl transition-colors p-8 sm:p-10">

          <CardHeader className="pb-1 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Sign in to your account with email or Google
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
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
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
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
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
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
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      name="remember"
                      checked={values.remember}
                      onCheckedChange={(checked) =>
                        setFieldValue("remember", checked)
                      }
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-gray-700 dark:text-gray-300 select-none"
                    >
                      Remember me
                    </label>
                  </div>

                  {/* Sign In Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center 
                                 bg-gradient-to-r from-indigo-600 to-blue-500 
                                 hover:from-indigo-700 hover:to-blue-600 
                                 text-white font-medium
                                 dark:from-indigo-500 dark:to-blue-400"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </motion.div>
                </form>
              )}
            </Formik>

            {/* Divider */}
            <div className="flex items-center my-6">
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
                className="w-full flex items-center justify-center 
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" fill="none">
                      <path fill="#4285F4" d="M533.5 278.4c0-17.8-1.6-35-4.7-51.7H272v97.9h146.9c-6.4 34.6-25.9 63.9-55.4 83.5v69.2h89.6c52.4-48.3 82.4-119.4 82.4-198.9z" />
                      <path fill="#34A853" d="M272 544.3c74.1 0 136.2-24.5 181.6-66.5l-89.6-69.2c-24.8 16.7-56.5 26.4-92 26.4-70.8 0-130.8-47.8-152.4-112.2H28.5v70.6C73.7 484.9 167.5 544.3 272 544.3z" />
                      <path fill="#FBBC05" d="M119.6 321.8c-5.6-16.7-8.8-34.6-8.8-53s3.2-36.3 8.8-53v-70.6H28.5C10.2 199 0 238.2 0 278.4c0 40.2 10.2 79.4 28.5 111.8l91.1-68.4z" />
                      <path fill="#EA4335" d="M272 107.7c39.9 0 75.8 13.7 104.1 40.6l78.1-78.1C404.6 24.7 343.1 0 272 0 167.5 0 73.7 59.4 28.5 149.8l91.1 70.6c21.6-64.4 81.6-112.7 152.4-112.7z" />
                    </svg>
                  </span>
                )}
                <span>Sign in with Google</span>
              </Button>
            </motion.div>

            {/* Forgot Password */}
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Forgot Password?{" "}
              <Link
                href="/next-learn-user-reset-pass"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Reset
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
