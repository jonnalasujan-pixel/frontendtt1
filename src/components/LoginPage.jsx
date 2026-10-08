import React, { useState } from 'react';
import { Pill, User, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { api } from '../services/api';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await api.login(username, password);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await api.register({ username, password, fullName, email, phone });
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Could not create your customer account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const user = await api.loginWithGoogle(credentialResponse.credential);
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)',
      padding: '1.5rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '520px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
          color: 'white',
          padding: '2rem 1.75rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            backdropFilter: 'blur(4px)'
          }}>
            <Pill size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px 0' }}>Crazy Medicals</h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: 0 }}>
            Pharmacy Management System (Indian Edition)
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem 1.75rem' }}>
          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#b91c1c',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            {mode === 'signup' && (
              <>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Full name</label>
                  <input type="text" required className="form-control" autoComplete="name" value={fullName}
                    onChange={e => setFullName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Email</label>
                  <input type="email" required className="form-control" autoComplete="email" value={email}
                    onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Phone (optional)</label>
                  <input type="tel" className="form-control" autoComplete="tel" value={phone}
                    onChange={e => setPhone(e.target.value)} />
                </div>
              </>
            )}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} color="#0284c7" />
                <span>{mode === 'login' ? 'Username or email' : 'Choose a username'}</span>
              </label>
              <input
                type="text"
                required
                className="form-control"
                placeholder={mode === 'login' ? 'Username or email address' : 'At least 3 characters'}
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: '0.75rem 0.9rem', fontSize: '0.95rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={15} color="#0284c7" />
                <span>Security Password</span>
              </label>
              <input
                type="password"
                required
                className="form-control"
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                minLength={mode === 'signup' ? 6 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '0.75rem 0.9rem', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '10px'
              }}
            >
              <span>{mode === 'login' ? 'Login to Pharmacy Portal' : 'Create customer account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <button type="button" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.75rem' }}
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Create a new customer account' : 'Back to sign in'}
          </button>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem', textAlign: 'center' }}>
            {mode === 'login' && googleClientId ? (
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in failed.')} />
            ) : mode === 'login' ? (
              <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>
                Google customer sign-in becomes available after OAuth setup.
              </p>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
}
