// Switches for features that depend on outside setup.

// Off until Supabase can send email (Authentication → Emails → SMTP
// Settings). While off, the "Forgot your password?" links and the profile's
// Change Password button are hidden, and /forgot-password shows a contact
// note instead of a form that would fail. Set to true once a test reset
// email arrives.
export const PASSWORD_RESET_EMAILS_ENABLED = false;
