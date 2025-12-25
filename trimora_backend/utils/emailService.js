const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP)
  // For production, replace with actual SMTP credentials

  if (process.env.NODE_ENV === 'production') {
    // Production email config (Gmail, SendGrid, etc.)
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Development - Manual config or ethereal
    // You can also use mailtrap.io for testing
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password',
      },
    });
  }
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'Trimora'} <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent. Please try again later.');
  }
};

// Send password reset OTP email
const sendPasswordResetEmail = async (user, otp) => {
  const message = `
    Hi ${user.name},
    
    You requested a password reset for your Treatseat account.
    
    Your OTP for password reset is: ${otp}
    
    This OTP will expire in 10 minutes.
    
    If you didn't request this, please ignore this email and your password will remain unchanged.
    
    Thanks,
    Treatseat Team
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 40px 30px; }
        .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin: 30px 0; }
        .otp-code { font-size: 48px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; font-family: "Courier New", monospace; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
        .info-box { background: #f9f9f9; padding: 20px; border-left: 4px solid #667eea; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f9f9f9; }
        .warning { color: #ff6b6b; font-weight: bold; }
        .highlight { color: #667eea; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset OTP</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>You requested to reset your password for your Trimora account.</p>
          <p>Use the following OTP to complete your password reset:</p>
          
          <div class="otp-box">
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Valid for 10 minutes</p>
          </div>
          
          <div class="info-box">
            <p style="margin: 0;"><strong>⏰ Important:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This OTP will <span class="warning">expire in 10 minutes</span></li>
              <li>Do not share this OTP with anyone</li>
              <li>Enter this OTP on the password reset page</li>
            </ul>
          </div>
          
          <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          
          <p style="margin-top: 30px;">Need help? Contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Trimora. All rights reserved.</p>
          <p style="color: #999; margin-top: 10px;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset OTP - Trimora',
    message,
    html,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
};
