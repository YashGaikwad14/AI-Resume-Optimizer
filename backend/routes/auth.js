const express = require('express');
const router = express.Router();
const { SignUpSchema, SignInSchema, getUserByEmail, createUser, signToken, ForgotSchema, ResetSchema, createResetToken, consumeResetToken, updatePassword, sendResetEmail, verifyToken, getUserById } = require('../models/auth');
const bcrypt = require('bcryptjs');

router.post('/signup', async (req, res) => {
  try {
    const parsed = SignUpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });
    }
    const { email, password, name } = parsed.data;
    const existing = await getUserByEmail(email);
    if (existing.error) return res.status(500).json({ error: existing.error });
    if (existing.data) return res.status(409).json({ error: 'Email already registered' });

    const created = await createUser({ email, password, name });
    if (created.error) return res.status(500).json({ error: created.error });
    const token = signToken({ user_id: created.data.id, email });
    res.json({ token, user: { id: created.data.id, email, name } });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const parsed = SignInSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors.map(e => e.message).join(', ') });
    }
    const { email, password } = parsed.data;
    const found = await getUserByEmail(email);
    if (found.error) return res.status(500).json({ error: found.error });
    if (!found.data) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, found.data.password_hash || '');
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ user_id: found.data.id, email });
    res.json({ token, user: { id: found.data.id, email, name: found.data.name } });
  } catch (err) {
    res.status(500).json({ error: 'Signin failed' });
  }
});

module.exports = router;

// Forgot password
router.post('/forgot', async (req, res) => {
  try {
    const parsed = ForgotSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Valid email required' });
    const { email } = parsed.data;
    const found = await getUserByEmail(email);
    if (found.error) return res.status(500).json({ error: found.error });
    if (!found.data) return res.json({ ok: true }); // do not leak
    const created = await createResetToken(found.data.id);
    if (created.error) return res.status(500).json({ error: created.error });
    // Send email if SMTP configured; still return token for dev
    const appBaseUrl = req.headers['x-app-base-url'] || process.env.APP_BASE_URL;
    await sendResetEmail({ to: email, token: created.token, appBaseUrl });
    res.json({ ok: true, token: created.token });
  } catch (err) {
    res.status(500).json({ error: 'Request failed' });
  }
});

// Reset password
router.post('/reset', async (req, res) => {
  try {
    const parsed = ResetSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
    const { token, password } = parsed.data;
    const claim = await consumeResetToken(token);
    if (claim.error) return res.status(400).json({ error: claim.error });
    const upd = await updatePassword(claim.user_id, password);
    if (upd.error) return res.status(500).json({ error: upd.error });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Reset failed' });
  }
});

// Get current user profile (includes premium status)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    const v = verifyToken(token);
    if (v.error) return res.status(401).json({ error: v.error });
    const user = await getUserById(v.claim.user_id);
    if (user.error) return res.status(500).json({ error: user.error });
    res.json({ user: user.data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Premium upgrade endpoint - requires payment verification
router.post('/upgrade', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    
    const v = verifyToken(token);
    if (v.error) return res.status(401).json({ error: v.error });
    
    // Check if user is already premium
    const user = await getUserById(v.claim.user_id);
    if (user.error) return res.status(500).json({ error: user.error });
    if (user.data.is_premium) {
      return res.status(400).json({ error: 'User is already premium' });
    }
    
    // For now, we'll implement a simple demo mode with restrictions
    // In production, this should integrate with a payment processor like Stripe
    const { paymentToken, paymentMethod } = req.body;
    
    if (!paymentToken && !paymentMethod) {
      return res.status(400).json({ 
        error: 'Payment verification required. Please provide payment details.',
        requiresPayment: true 
      });
    }
    
    // TODO: Integrate with actual payment processor (Stripe, PayPal, etc.)
    // For demo purposes, we'll add some basic validation
    if (paymentMethod === 'demo' && process.env.NODE_ENV === 'development') {
      // Only allow demo upgrades in development mode
      if (!require('../models/supabase').supabase) return res.status(500).json({ error: 'supabase not configured' });
      const { supabase } = require('../models/supabase');
      const { error } = await supabase.from('users').update({ is_premium: true }).eq('id', v.claim.user_id);
      if (error) return res.status(500).json({ error: error.message });
      res.json({ ok: true, message: 'Demo upgrade successful' });
    } else {
      // In production, verify payment with payment processor
      res.status(402).json({ 
        error: 'Payment required. Please complete payment to upgrade to premium.',
        requiresPayment: true,
        paymentUrl: '/payment' // Redirect to payment page
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to upgrade' });
  }
});