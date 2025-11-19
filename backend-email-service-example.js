/**
 * Backend Email Service Example
 * 
 * This is an example of how to set up a backend email service
 * using Node.js and Express with Brevo/Mailgun/SendGrid
 * 
 * Install dependencies:
 * npm install express nodemailer dotenv cors
 */

// ============================================
// OPTION 1: Using Nodemailer with Brevo SMTP
// ============================================

const express = require('express')
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()
app.use(express.json())

// Configure Brevo SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})

/**
 * Send custom email
 * POST /api/send-email
 */
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html, text, from, replyTo } = req.body

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({
        error: 'Missing required fields: to, subject, and (html or text)'
      })
    }

    // Send email
    const info = await transporter.sendMail({
      from: from || process.env.SENDER_EMAIL || 'noreply@bi3wechri.com',
      to,
      subject,
      html,
      text,
      replyTo: replyTo || process.env.REPLY_TO_EMAIL
    })

    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    })
  } catch (error) {
    console.error('Email send error:', error)
    res.status(500).json({
      error: error.message || 'Failed to send email'
    })
  }
})

/**
 * Send welcome email
 * POST /api/send-welcome-email
 */
app.post('/api/send-welcome-email', async (req, res) => {
  try {
    const { email, fullName } = req.body

    if (!email || !fullName) {
      return res.status(400).json({
        error: 'Missing required fields: email, fullName'
      })
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #0ea5e9; }
          .content { color: #333; line-height: 1.6; }
          .button { display: inline-block; background: linear-gradient(to right, #0ea5e9, #0284c7); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Bi3wEchri</div>
            <p style="color: #999; margin: 5px 0;">Marketplace</p>
          </div>
          
          <div class="content">
            <h2>Welcome to Bi3wEchri, ${fullName}!</h2>
            <p>We're excited to have you join our marketplace.</p>
            <p>You can now:</p>
            <ul>
              <li>Browse and purchase items</li>
              <li>Create and manage your ads</li>
              <li>Connect with other users</li>
              <li>Save your favorite listings</li>
            </ul>
            <p>
              <a href="https://yourdomain.com/create-ad" class="button">Create Your First Ad</a>
            </p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Happy trading!</p>
          </div>
          
          <div class="footer">
            <p>© 2024 Bi3wEchri Marketplace. All rights reserved.</p>
            <p>Contact us: support@bi3wechri.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL || 'noreply@bi3wechri.com',
      to: email,
      subject: 'Welcome to Bi3wEchri Marketplace',
      html: htmlContent
    })

    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Welcome email sent successfully'
    })
  } catch (error) {
    console.error('Email send error:', error)
    res.status(500).json({
      error: error.message || 'Failed to send email'
    })
  }
})

/**
 * Send ad posted notification
 * POST /api/send-ad-posted-email
 */
app.post('/api/send-ad-posted-email', async (req, res) => {
  try {
    const { email, adTitle, adUrl } = req.body

    if (!email || !adTitle || !adUrl) {
      return res.status(400).json({
        error: 'Missing required fields: email, adTitle, adUrl'
      })
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #0ea5e9; }
          .content { color: #333; line-height: 1.6; }
          .button { display: inline-block; background: linear-gradient(to right, #0ea5e9, #0284c7); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Bi3wEchri</div>
            <p style="color: #999; margin: 5px 0;">Marketplace</p>
          </div>
          
          <div class="content">
            <h2>Your Ad is Live!</h2>
            <p>Your ad "<strong>${adTitle}</strong>" has been successfully posted on Bi3wEchri Marketplace.</p>
            <p>
              <a href="${adUrl}" class="button">View Your Ad</a>
            </p>
            <p>You can manage your ads from your dashboard.</p>
            <p>Best regards,<br>Bi3wEchri Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 Bi3wEchri Marketplace. All rights reserved.</p>
            <p>Contact us: support@bi3wechri.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL || 'noreply@bi3wechri.com',
      to: email,
      subject: `Your ad "${adTitle}" has been posted`,
      html: htmlContent
    })

    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Ad posted email sent successfully'
    })
  } catch (error) {
    console.error('Email send error:', error)
    res.status(500).json({
      error: error.message || 'Failed to send email'
    })
  }
})

/**
 * Send message notification
 * POST /api/send-message-notification
 */
app.post('/api/send-message-notification', async (req, res) => {
  try {
    const { email, senderName, messagePreview } = req.body

    if (!email || !senderName || !messagePreview) {
      return res.status(400).json({
        error: 'Missing required fields: email, senderName, messagePreview'
      })
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #0ea5e9; }
          .content { color: #333; line-height: 1.6; }
          .message-box { background: #f9f9f9; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(to right, #0ea5e9, #0284c7); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Bi3wEchri</div>
            <p style="color: #999; margin: 5px 0;">Marketplace</p>
          </div>
          
          <div class="content">
            <h2>You have a new message</h2>
            <p><strong>${senderName}</strong> sent you a message:</p>
            <div class="message-box">
              ${messagePreview}
            </div>
            <p>
              <a href="https://yourdomain.com/messages" class="button">Reply to Message</a>
            </p>
            <p>Best regards,<br>Bi3wEchri Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 Bi3wEchri Marketplace. All rights reserved.</p>
            <p>Contact us: support@bi3wechri.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    const info = await transporter.sendMail({
      from: process.env.SENDER_EMAIL || 'noreply@bi3wechri.com',
      to: email,
      subject: `New message from ${senderName}`,
      html: htmlContent
    })

    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Message notification sent successfully'
    })
  } catch (error) {
    console.error('Email send error:', error)
    res.status(500).json({
      error: error.message || 'Failed to send email'
    })
  }
})

/**
 * Health check endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email service is running' })
})

/**
 * Verify SMTP connection
 * GET /api/verify-smtp
 */
app.get('/api/verify-smtp', async (req, res) => {
  try {
    await transporter.verify()
    res.json({
      success: true,
      message: 'SMTP connection verified successfully'
    })
  } catch (error) {
    console.error('SMTP verification error:', error)
    res.status(500).json({
      error: error.message || 'SMTP verification failed'
    })
  }
})

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`)
})

// ============================================
// ENVIRONMENT VARIABLES (.env)
// ============================================
/*
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-smtp-key
SENDER_EMAIL=noreply@yourdomain.com
SENDER_NAME=Bi3wEchri Marketplace
REPLY_TO_EMAIL=support@yourdomain.com
PORT=3001
*/

// ============================================
// USAGE IN FRONTEND
// ============================================
/*
// Send welcome email
const sendWelcomeEmail = async (email, fullName) => {
  const response = await fetch('/api/send-welcome-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, fullName })
  })
  return response.json()
}

// Send ad posted notification
const sendAdPostedEmail = async (email, adTitle, adUrl) => {
  const response = await fetch('/api/send-ad-posted-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, adTitle, adUrl })
  })
  return response.json()
}

// Send message notification
const sendMessageNotification = async (email, senderName, messagePreview) => {
  const response = await fetch('/api/send-message-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senderName, messagePreview })
  })
  return response.json()
}
*/
