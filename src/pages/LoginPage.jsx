import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Clock, CalendarCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { requestPasswordReset, DEMO_CREDENTIALS } from '../services/authService';
import { Alert, Button, Input, Logo, Modal } from '../components/common';

const highlights = [
  { icon: ShieldCheck, text: 'Real-time FDTL compliance monitoring' },
  { icon: Clock, text: 'FDP, flight time, rest and WOCL tracking' },
  { icon: CalendarCheck, text: 'Duty planning with pre-assignment validation' },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate(location.state?.from ?? '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    const response = await requestPasswordReset(resetEmail || form.email);
    setResetMessage(response.detail);
  };

  return (
    <div className="login">
      <section className="login__brand">
        <div className="login__brand-inner">
          <Logo size={52} subtitle="Flight Operations" />
          <h1>
            FDTL MANAGEMENT
            <br />
            SYSTEM
          </h1>
          <p className="login__tagline">Flight Duty Time Limit Monitoring</p>
          <ul className="login__highlights">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon size={18} /> {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="login__copyright">© 2026 MADDY AVIATION. All rights reserved.</p>
      </section>

      <section className="login__form-side">
        <form className="login__card" onSubmit={handleSubmit} noValidate>
          <div className="login__mobile-logo">
            <Logo size={40} inverted={false} />
          </div>
          <p className="login__eyebrow">MADDY AVIATION</p>
          <h2>Sign in to your account</h2>
          <p className="login__subtitle">FDTL Management System</p>

          {error && <Alert tone="danger" title={error} />}

          <Input label="Email" name="email" type="email" icon={Mail} autoComplete="username" placeholder="you@maddyaviation.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <div className="password-field">
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            <button type="button" className="password-field__toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="login__row">
            <label className="checkbox">
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <button type="button" className="link-button" onClick={() => { setResetOpen(true); setResetMessage(''); }}>
              Forgot Password?
            </button>
          </div>

          <Button type="submit" size="lg" block loading={submitting}>
            Login
          </Button>

          <div className="login__demo">
            <strong>Prototype login</strong>
            <span>{DEMO_CREDENTIALS.email}</span>
            <span>Password: {DEMO_CREDENTIALS.password}</span>
            <button type="button" className="link-button" onClick={() => setForm({ ...DEMO_CREDENTIALS })}>
              Fill demo credentials
            </button>
          </div>
        </form>
      </section>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset Password"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>Close</Button>
            {!resetMessage && <Button onClick={handleReset}>Send Reset Link</Button>}
          </>
        }
      >
        {resetMessage ? (
          <Alert tone="success" title="Check your inbox">{resetMessage} (simulated)</Alert>
        ) : (
          <Input label="Email" name="resetEmail" type="email" icon={Mail} value={resetEmail} placeholder="you@maddyaviation.com" onChange={(event) => setResetEmail(event.target.value)} />
        )}
      </Modal>
    </div>
  );
}
