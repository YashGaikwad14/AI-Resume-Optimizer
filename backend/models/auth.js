const { z } = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('./supabase');
const crypto = require('crypto');

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  name: z.string().min(2).max(100)
});

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

async function getUserByEmail(email) {
  if (!supabase) return { error: 'supabase not configured' };
  const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
  if (error) return { error: error.message };
  return { data };
}

async function createUser({ email, password, name }) {
  if (!supabase) return { error: 'supabase not configured' };
  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert({ email, password_hash, name })
    .select()
    .single();
  if (error) return { error: error.message };
  return { data };
}

function signToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

module.exports = {
  SignUpSchema,
  SignInSchema,
  getUserByEmail,
  createUser,
  signToken
};

// Password reset helpers
const ForgotSchema = z.object({ email: z.string().email() });
const ResetSchema = z.object({ token: z.string().min(20), password: z.string().min(8).max(72) });

async function createResetToken(userId) {
  if (!supabase) return { error: 'supabase not configured' };
  const token = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1h
  const { data, error } = await supabase.from('password_resets').insert({ user_id: userId, token, expires_at }).select().single();
  if (error) return { error: error.message };
  return { data, token };
}

async function consumeResetToken(token) {
  if (!supabase) return { error: 'supabase not configured' };
  const { data, error } = await supabase.from('password_resets').select('*').eq('token', token).maybeSingle();
  if (error) return { error: error.message };
  if (!data) return { error: 'Invalid token' };
  if (new Date(data.expires_at).getTime() < Date.now()) return { error: 'Token expired' };
  await supabase.from('password_resets').delete().eq('id', data.id);
  return { user_id: data.user_id };
}

async function updatePassword(userId, newPassword) {
  if (!supabase) return { error: 'supabase not configured' };
  const password_hash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabase.from('users').update({ password_hash }).eq('id', userId);
  if (error) return { error: error.message };
  return { ok: true };
}

module.exports.ForgotSchema = ForgotSchema;
module.exports.ResetSchema = ResetSchema;
module.exports.createResetToken = createResetToken;
module.exports.consumeResetToken = consumeResetToken;
module.exports.updatePassword = updatePassword;




