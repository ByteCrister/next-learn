// app/next-learn-user-authentication/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import GoogleIcon from "@mui/icons-material/Google";

interface SignInFormValues {
  email: string
  password: string
}

const errorMessages: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  OAuthSignin: "Error in OAuth sign in.",
  OAuthCallback: "Error during OAuth callback.",
  OAuthCreateAccount: "Could not create OAuth account.",
  EmailCreateAccount: "Could not create email account.",
  Callback: "Error in authentication callback.",
  AccessDenied: "Access denied.",
  default: "Something went wrong. Please try again.",
}

const SignInPage =() => {
  const router = useRouter()
  const params = useSearchParams()
  const oauthError = params.get("error")
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useForm<SignInFormValues>({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  })

  useEffect(() => {
    if (oauthError) {
      setAuthError(errorMessages[oauthError] ?? errorMessages.default)
    }
  }, [oauthError])

  async function onSubmit(data: SignInFormValues) {
    setAuthError(null)
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    })

    if (res?.error) {
      // show invalid credentials
      setAuthError(errorMessages[res.error] ?? errorMessages.default)
    } else {
      router.push("/") // or your protected route
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in with your email and password or continue with Google.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <p className="text-sm text-red-600 mb-2">{authError}</p>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </Form>

            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-200" />
              <span className="px-2 text-sm text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => signIn("google")}
            >
              <GoogleIcon className="w-5 h-5 mr-2" /> Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SignInPage;