'use client'

import { useState, useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  requestOTP as apiRequestOTP,
  verifyOTP as apiVerifyOTP,
  resendOTP as apiResendOTP,
  resetPassword as apiResetPassword,
  getMessage,
} from '@/utils/api/api.reset-password'
import { ApiError } from '@/utils/api/api.client'
import { isAxiosError } from 'axios'

import {
  resetPasswordValidationSchema,
  ResetPasswordFormValues,
} from '@/utils/auth/ResetPassValidation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'reset' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(0)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [loading, setLoading] = useState({
    request: false,
    verify: false,
    resend: false,
    reset: false,
  })
  const [otpError, setOtpError] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))

  // Countdown timers
  useEffect(() => {
    if (timer > 0) {
      const id = setInterval(() => setTimer((t) => t - 1), 1_000)
      return () => clearInterval(id)
    }
  }, [timer])

  useEffect(() => {
    if (resendCooldown > 0) {
      const id = setInterval(() => setResendCooldown((t) => t - 1), 1_000)
      return () => clearInterval(id)
    }
  }, [resendCooldown])

  // Formik for reset step
  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: resetPasswordValidationSchema,
    onSubmit: async (values) => {
      setLoading((l) => ({ ...l, reset: true }))
      try {
        await apiResetPassword({ email, newPassword: values.newPassword })
        toast.success('Password reset successful')
        setStep('success')
      } catch (err) {
        toast.error(getMessage(err as ApiError))
      } finally {
        setLoading((l) => ({ ...l, reset: false }))
      }
    },
  })

  const formatTime = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0')
    const s = String(secs % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  // Handlers
  const handleRequestOTP = async () => {
    if (!email) return toast.error('Enter a valid email')
    setLoading((l) => ({ ...l, request: true }))
    try {
      const { otpExpiresAt } = await apiRequestOTP({ email })
      toast.success('OTP sent to your inbox')
      setStep('otp')
      setTimer(Math.max(0, Math.floor((new Date(otpExpiresAt).getTime() - Date.now()) / 1000)))
      setResendCooldown(30)
    } catch (err) {
      toast.error(getMessage(err as ApiError))
    } finally {
      setLoading((l) => ({ ...l, request: false }))
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '') // allow only digits
    const next = otp.split('')

    next[idx] = val[0] || '' // set digit or empty string
    const newOtp = next.join('')
    setOtp(newOtp)

    // auto-focus next input only if a digit was entered
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus()
      const next = otp.split('')
      next[idx - 1] = ''
      setOtp(next.join(''))
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError(true)
      setTimeout(() => setOtpError(false), 500)
      return toast.error('Enter a 6-digit OTP')
    }
    setLoading((l) => ({ ...l, verify: true }))
    try {
      await apiVerifyOTP({ email, otp })
      toast.success('OTP verified! You may reset your password.')
      setStep('reset')
      setTimer(0)
    } catch (err: unknown) {
      let msg = 'Failed to verify OTP'
      if (isAxiosError(err)) {
        msg = err.response?.data?.error ?? err.message
      }
      setOtpError(true)
      setTimeout(() => setOtpError(false), 500)
      toast.error(msg)
    } finally {
      setLoading((l) => ({ ...l, verify: false }))
    }
  }

  const handleResendOTP = async () => {
    setLoading((l) => ({ ...l, resend: true }))
    try {
      const { otpExpiresAt } = await apiResendOTP({ email })
      toast.info('OTP resent')
      setTimer(Math.max(0, Math.floor((new Date(otpExpiresAt).getTime() - Date.now()) / 1000)))
      setResendCooldown(30)
    } catch {
      toast.error('Please wait before resending.')
    } finally {
      setLoading((l) => ({ ...l, resend: false }))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-xl border border-blue-200 dark:border-blue-700 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-center text-blue-700 dark:text-blue-400">
              {step === 'email' && 'Reset Your Password'}
              {step === 'otp' && 'Enter OTP'}
              {step === 'reset' && 'New Password'}
              {step === 'success' && 'Success!'}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {step === 'email' && (
              <>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-blue-50 dark:bg-gray-700 border-blue-300 dark:border-blue-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                />
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors duration-300"
                    onClick={handleRequestOTP}
                    disabled={loading.request}
                  >
                    {loading.request ? 'Sending…' : 'Send OTP'}
                  </Button>
                </motion.div>
              </>
            )}

            {step === 'otp' && (
              <>
                <motion.div
                  animate={
                    otpError
                      ? { x: [0, -10, 10, -10, 10, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.4 }}
                  className="flex justify-center gap-2 mb-4"
                >
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <motion.input
                      key={idx}
                      ref={(el: HTMLInputElement | null) => {
                        inputsRef.current[idx] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[idx] || ''}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className="w-12 h-12 text-center border rounded focus:ring-2 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500"
                      whileFocus={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      disabled={timer === 0}
                    />
                  ))}
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button
                    className="w-full mb-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                    onClick={handleVerifyOTP}
                    disabled={loading.verify}
                  >
                    {loading.verify ? 'Verifying…' : 'Verify OTP'}
                  </Button>
                </motion.div>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-2">
                  Expires in:{' '}
                  <span className="font-mono">{formatTime(timer)}</span>
                </p>

                {timer === 0 && (
                  <motion.div whileHover={{ scale: 1.03 }}>
                    <Button
                      variant="outline"
                      className="w-full border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700"
                      onClick={handleResendOTP}
                      disabled={loading.resend}
                    >
                      {loading.resend ? 'Resending…' : 'Resend OTP'}
                    </Button>
                  </motion.div>
                )}
              </>
            )}

            {step === 'reset' && (
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-4"
              >
                <div>
                  <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-200">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 bg-blue-50 dark:bg-gray-700 border-blue-300 dark:border-blue-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 bg-blue-50 dark:bg-gray-700 border-blue-300 dark:border-blue-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
                </div>

                <motion.div whileHover={{ scale: 1.03 }}>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                    disabled={loading.reset}
                  >
                    {loading.reset ? 'Resetting…' : 'Reset Password'}
                  </Button>
                </motion.div>
              </form>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-green-600 dark:text-green-400">
                  Your password has been reset. You can now log in with your new credentials.
                </p>
                <Button
                  className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                  onClick={() => (window.location.href = '/signin')}
                >
                  Go to Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
