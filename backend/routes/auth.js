const express = require('express');
const router = express.Router();
const { SignUpSchema, SignInSchema, getUserByEmail, createUser, signToken, ForgotSchema, ResetSchema, createResetToken, consumeResetToken, updatePassword } = require('../models/auth');
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
    // TODO: email token - for now return token in response for testing
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




