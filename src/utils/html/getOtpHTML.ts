export const getOtpHTML = (newOtp: string) => {
    return `
<div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; color: #333; background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="text-align: center; color: #2c3e50;">🔐 Verify Your Identity</h2>
  <p style="font-size: 16px; line-height: 1.5;">Hey there,</p>
  <p style="font-size: 16px; line-height: 1.5;">
    We received a request to authenticate your account. Use the 6-digit code below to continue.
  </p>
  <div style="text-align: center; margin: 30px 0;">
    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2c3e50; background: #eaf6ff; padding: 10px 20px; border-radius: 10px;">
      ${newOtp}
    </span>
  </div>
  <p style="font-size: 14px; color: #999; margin-top: 40px;">
    If you didn’t request this, please ignore this email or secure your account.
  </p>
  <p style="font-size: 14px; color: #999; text-align: center; margin-top: 20px;">
    &mdash; Next Learn   &mdash;
  </p>
</div>`;

}