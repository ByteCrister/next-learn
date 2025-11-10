export const HTMLContent = (newOtp: string) => {
  return `
<div style="max-width:600px;margin:auto;font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f8;color:#333;">
  <div style="background:#fff;border-radius:12px;border:1px solid #e0e0e0;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#2c3e50,#3498db);padding:20px;text-align:center;color:#fff;">
      <div style="font-size:40px;">🔐</div>
      <h2 style="margin:10px 0 0;font-size:22px;font-weight:600;">Verify Your Identity</h2>
    </div>

    <!-- Body -->
    <div style="padding:24px;">
      <p style="font-size:16px;line-height:1.6;margin:0 0 12px;">Hi there 📧,</p>
      <p style="font-size:16px;line-height:1.6;margin:0 0 20px;">
        We received a request to reset your password. Use the 6‑digit code below to continue:
      </p>

      <!-- OTP Box -->
      <div style="text-align:center;margin:32px 0;">
        <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#2c3e50;background:#eaf6ff;padding:14px 28px;border-radius:8px;border:1px solid #b9dfff;display:inline-block;">
          ${newOtp}
        </span>
      </div>

      <!-- Note -->
      <p style="font-size:14px;color:#777;line-height:1.5;margin:0 0 16px;">
        ⏳ This code will expire in <strong>1 minutes</strong> for your security.
      </p>
      <p style="font-size:14px;color:#777;line-height:1.5;margin:0;">
        If you didn’t request this, you can safely ignore this email or 
        <a href="#" style="color:#3498db;text-decoration:none;">secure your account</a>.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9f9f9;text-align:center;padding:16px;font-size:13px;color:#999;">
      Made with 🚀 for lifelong learning 📖 by <strong>Next Learn</strong><br/>
      <span style="font-size:12px;">© ${new Date().getFullYear()} All rights reserved.</span>
    </div>

  </div>
</div>
`;
};
