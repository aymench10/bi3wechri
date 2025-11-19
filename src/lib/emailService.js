import { supabase } from './supabase'

/**
 * Email Service - Handles all email-related operations
 * Integrates with Supabase Auth and custom SMTP providers
 */

/**
 * Send password reset email
 * @param {string} email - User's email address
 * @param {string} redirectUrl - URL to redirect after reset (optional)
 * @returns {Promise<{data, error}>}
 */
export const sendPasswordResetEmail = async (email, redirectUrl = null) => {
  try {
    const resetUrl = redirectUrl || `${window.location.origin}/auth/reset-password`
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetUrl
    })

    if (error) throw error

    return {
      data,
      error: null,
      message: 'Password reset email sent. Please check your inbox.'
    }
  } catch (err) {
    console.error('Error sending password reset email:', err)
    return {
      data: null,
      error: err,
      message: err.message || 'Failed to send password reset email'
    }
  }
}

/**
 * Resend confirmation email
 * @param {string} email - User's email address
 * @returns {Promise<{data, error}>}
 */
export const resendConfirmationEmail = async (email) => {
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })

    if (error) throw error

    return {
      data,
      error: null,
      message: 'Confirmation email resent. Please check your inbox.'
    }
  } catch (err) {
    console.error('Error resending confirmation email:', err)
    return {
      data: null,
      error: err,
      message: err.message || 'Failed to resend confirmation email'
    }
  }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<{data, error}>}
 */
export const updateUserPassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error

    return {
      data,
      error: null,
      message: 'Password updated successfully'
    }
  } catch (err) {
    console.error('Error updating password:', err)
    return {
      data: null,
      error: err,
      message: err.message || 'Failed to update password'
    }
  }
}

/**
 * Update user email
 * @param {string} newEmail - New email address
 * @returns {Promise<{data, error}>}
 */
export const updateUserEmail = async (newEmail) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail
    })

    if (error) throw error

    return {
      data,
      error: null,
      message: 'Confirmation email sent to your new email address'
    }
  } catch (err) {
    console.error('Error updating email:', err)
    return {
      data: null,
      error: err,
      message: err.message || 'Failed to update email'
    }
  }
}

/**
 * Get email confirmation status
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export const getEmailConfirmationStatus = async (userId) => {
  try {
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId)

    if (error) throw error

    return user?.email_confirmed_at ? true : false
  } catch (err) {
    console.error('Error checking email confirmation status:', err)
    return false
  }
}

/**
 * Send custom email via email provider API
 * This is for sending emails outside of Supabase Auth
 * @param {object} options - Email options
 * @returns {Promise<{data, error}>}
 */
export const sendCustomEmail = async (options) => {
  const {
    to,
    subject,
    html,
    text,
    from = process.env.VITE_SENDER_EMAIL || 'noreply@bi3wechri.com',
    replyTo = null
  } = options

  try {
    // This would call your backend API that handles email sending
    // For now, we'll log it as a placeholder
    console.log('Sending custom email:', {
      to,
      subject,
      from,
      replyTo
    })

    // Example: Call your backend email endpoint
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ to, subject, html, text, from, replyTo })
    // })

    return {
      data: { message: 'Email queued for sending' },
      error: null
    }
  } catch (err) {
    console.error('Error sending custom email:', err)
    return {
      data: null,
      error: err
    }
  }
}

/**
 * Email template helpers
 */
export const emailTemplates = {
  /**
   * Welcome email template
   */
  welcome: (fullName, email) => ({
    subject: 'Welcome to Bi3wEchri Marketplace',
    html: `
      <h2>Welcome to Bi3wEchri, ${fullName}!</h2>
      <p>We're excited to have you join our marketplace.</p>
      <p>You can now:</p>
      <ul>
        <li>Browse and purchase items</li>
        <li>Create and manage your ads</li>
        <li>Connect with other users</li>
        <li>Save your favorite listings</li>
      </ul>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Happy trading!</p>
      <p>Best regards,<br>Bi3wEchri Team</p>
    `,
    text: `Welcome to Bi3wEchri, ${fullName}!\n\nWe're excited to have you join our marketplace.\n\nYou can now browse, purchase, and sell items on our platform.\n\nBest regards,\nBi3wEchri Team`
  }),

  /**
   * Ad posted notification template
   */
  adPosted: (adTitle, adUrl) => ({
    subject: `Your ad "${adTitle}" has been posted`,
    html: `
      <h2>Your ad is live!</h2>
      <p>Your ad "<strong>${adTitle}</strong>" has been successfully posted on Bi3wEchri Marketplace.</p>
      <p>
        <a href="${adUrl}" style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View Your Ad
        </a>
      </p>
      <p>You can manage your ads from your dashboard.</p>
      <p>Best regards,<br>Bi3wEchri Team</p>
    `,
    text: `Your ad "${adTitle}" has been posted!\n\nView it here: ${adUrl}\n\nBest regards,\nBi3wEchri Team`
  }),

  /**
   * Ad sold notification template
   */
  adSold: (adTitle, buyerName) => ({
    subject: `Your ad "${adTitle}" has been sold!`,
    html: `
      <h2>Congratulations!</h2>
      <p>Your ad "<strong>${adTitle}</strong>" has been sold to <strong>${buyerName}</strong>.</p>
      <p>Please check your messages for communication with the buyer.</p>
      <p>Thank you for using Bi3wEchri Marketplace!</p>
      <p>Best regards,<br>Bi3wEchri Team</p>
    `,
    text: `Your ad "${adTitle}" has been sold to ${buyerName}!\n\nBest regards,\nBi3wEchri Team`
  }),

  /**
   * Message received notification template
   */
  messageReceived: (senderName, previewText) => ({
    subject: `New message from ${senderName}`,
    html: `
      <h2>You have a new message</h2>
      <p><strong>${senderName}</strong> sent you a message:</p>
      <blockquote style="border-left: 4px solid #0ea5e9; padding-left: 10px; margin: 20px 0;">
        ${previewText}
      </blockquote>
      <p>
        <a href="${window.location.origin}/messages" style="background-color: #0ea5e9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reply to Message
        </a>
      </p>
      <p>Best regards,<br>Bi3wEchri Team</p>
    `,
    text: `You have a new message from ${senderName}:\n\n${previewText}\n\nBest regards,\nBi3wEchri Team`
  })
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if email is confirmed
 * @param {object} user - Supabase user object
 * @returns {boolean}
 */
export const isEmailConfirmed = (user) => {
  return user?.email_confirmed_at ? true : false
}

/**
 * Get time until email confirmation expires
 * @param {object} user - Supabase user object
 * @returns {string} - Human readable time remaining
 */
export const getConfirmationTimeRemaining = (user) => {
  if (!user?.confirmation_sent_at) return null

  const sentAt = new Date(user.confirmation_sent_at)
  const expiresAt = new Date(sentAt.getTime() + 24 * 60 * 60 * 1000) // 24 hours
  const now = new Date()
  const remaining = expiresAt - now

  if (remaining <= 0) return 'Expired'

  const hours = Math.floor(remaining / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours}h ${minutes}m`
}

export default {
  sendPasswordResetEmail,
  resendConfirmationEmail,
  updateUserPassword,
  updateUserEmail,
  getEmailConfirmationStatus,
  sendCustomEmail,
  emailTemplates,
  isValidEmail,
  isEmailConfirmed,
  getConfirmationTimeRemaining
}
