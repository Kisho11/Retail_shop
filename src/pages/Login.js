import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UiIcon from '../components/UiIcon';
import Seo from '../components/Seo';

function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const operator = Math.random() > 0.5 ? '+' : '-';
  const result = operator === '+' ? a + b : a - b;
  return {
    question: `${a} ${operator} ${b}`,
    answer: result,
  };
}

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const googleBtnRef = useRef(null);

  const { login, signUpCustomer, signInCustomer, resetCustomerPassword, authWithGoogle } = useAuth();

  const [mode, setMode] = useState('customer-signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const isCustomerMode = mode === 'customer-signin' || mode === 'customer-signup';

  const captchaValid = useMemo(() => Number(captchaInput) === captcha.answer, [captchaInput, captcha.answer]);

  useEffect(() => {
    const requestedMode = searchParams.get('mode');
    if (requestedMode === 'customer-signup' || requestedMode === 'customer-signin' || requestedMode === 'staff-signin') {
      setMode(requestedMode);
    } else if (window.location.pathname === '/signup') {
      setMode('customer-signup');
    }
  }, [searchParams]);

  const resetCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  useEffect(() => {
    resetCaptcha();
    setError('');
    setGoogleError('');
    setSuccessMessage('');
    setShowForgotPassword(false);
  }, [mode]);

  useEffect(() => {
    if (!isCustomerMode || !googleClientId) return;

    const scriptId = 'google-identity-script';

    const renderGoogleButton = () => {
      if (!window.google || !googleBtnRef.current) return;

      googleBtnRef.current.innerHTML = '';

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          const result = authWithGoogle(response.credential, mode === 'customer-signup' ? 'signup' : 'signin');
          if (result.success) {
            navigate('/customer-portal');
          } else {
            setGoogleError(result.error || 'Google authentication failed');
          }
        },
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: mode === 'customer-signup' ? 'signup_with' : 'signin_with',
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.addEventListener('load', renderGoogleButton);
      return () => existing.removeEventListener('load', renderGoogleButton);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [authWithGoogle, googleClientId, isCustomerMode, mode, navigate]);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const ensureCaptcha = () => {
    if (!captchaValid) {
      setError('Captcha verification failed. Please try again.');
      resetCaptcha();
      return false;
    }
    return true;
  };

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!ensureCaptcha()) return;

    setLoading(true);
    const result = login(email, password);
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/manager/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleCustomerSignIn = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!ensureCaptcha()) return;

    setLoading(true);
    const result = signInCustomer(email, password);
    if (result.success) {
      navigate('/customer-portal');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleCustomerSignUp = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!ensureCaptcha()) return;

    setLoading(true);
    const result = signUpCustomer({ name, email, password });
    if (result.success) {
      navigate('/customer-portal');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!resetEmail.trim()) {
      setError('Please enter your customer email address.');
      return;
    }

    if (resetPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (resetPassword !== resetConfirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    const result = resetCustomerPassword(resetEmail, resetPassword);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setEmail(resetEmail.trim().toLowerCase());
    setPassword('');
    setResetPassword('');
    setResetConfirmPassword('');
    setShowForgotPassword(false);
    setSuccessMessage('Password updated. You can now sign in with your new password.');
  };

  const demoLogin = (role) => {
    setMode('staff-signin');
    setError('');
    if (role === 'admin') {
      setEmail('admin@elamshelf.com');
      setPassword('admin123');
    } else {
      setEmail('manager@elamshelf.com');
      setPassword('manager123');
    }
  };

  const currentSubmitHandler =
    mode === 'staff-signin'
      ? handleStaffSubmit
      : mode === 'customer-signup'
        ? handleCustomerSignUp
        : handleCustomerSignIn;

  return (
    <div className="flex h-[100svh] items-start justify-center overflow-hidden bg-gradient-to-br from-primary to-black px-3 py-3 sm:items-center sm:px-4 sm:py-4">
      <Seo title="Account Access" description="Sign in or create your Elmshelf account." noindex />
      <div className="flex max-h-full w-full max-w-lg flex-col justify-start sm:justify-center">
        <div className="mb-3 text-center sm:mb-6">
          <div className="mb-2 flex justify-center text-white sm:mb-3">
            <UiIcon name="box" className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <h1 className="mb-1 text-2xl font-bold text-white sm:mb-2 sm:text-4xl">Elamshelf Access</h1>
          <p className="text-xs text-blue-100 sm:text-base">Customer and staff authentication</p>
        </div>

        <div className="max-h-[calc(100svh-8.5rem)] overflow-y-auto rounded-2xl bg-white p-3 shadow-2xl sm:max-h-[calc(100svh-10rem)] sm:p-8">
          <div className="mb-3 grid grid-cols-3 gap-2 sm:mb-6">
            <button
              onClick={() => setMode('customer-signin')}
              className={`rounded-lg px-2 py-2 text-[11px] font-bold sm:px-3 sm:text-xs ${mode === 'customer-signin' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Customer Sign In
            </button>
            <button
              onClick={() => setMode('customer-signup')}
              className={`rounded-lg px-2 py-2 text-[11px] font-bold sm:px-3 sm:text-xs ${mode === 'customer-signup' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Customer Sign Up
            </button>
            <button
              onClick={() => setMode('staff-signin')}
              className={`rounded-lg px-2 py-2 text-[11px] font-bold sm:px-3 sm:text-xs ${mode === 'staff-signin' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Staff Login
            </button>
          </div>

          <h2 className="mb-3 text-lg font-bold text-primary sm:mb-6 sm:text-2xl">
            {mode === 'customer-signup' && 'Create Customer Account'}
            {mode === 'customer-signin' && 'Customer Sign In'}
            {mode === 'staff-signin' && 'Staff Sign In'}
          </h2>

          {(error || googleError) && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error || googleError}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={currentSubmitHandler} className="space-y-2.5 sm:space-y-4">
            {mode === 'customer-signup' && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none sm:py-2.5"
                  required
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none sm:py-2.5"
                  required
                />
              </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none sm:py-2.5"
                  required
                />
              </div>

            {mode === 'customer-signin' && (
              <div className="-mt-1 text-right">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword((prev) => !prev);
                    setResetEmail(email);
                    setSuccessMessage('');
                    setError('');
                  }}
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  {showForgotPassword ? 'Hide reset form' : 'Forgot password?'}
                </button>
              </div>
            )}

            {mode === 'customer-signin' && showForgotPassword && (
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-800">Reset Customer Password</p>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Customer email"
                  required
                />
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="New password"
                  required
                />
                <input
                  type="password"
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="w-full rounded-lg border border-primary bg-white py-2 text-sm font-bold text-primary transition hover:bg-red-50"
                >
                  Update Password
                </button>
              </div>
            )}

            {mode === 'customer-signup' && (
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none sm:py-2.5"
                  required
                />
              </div>
            )}

            <div className="rounded-lg border border-slate-300 bg-slate-50 p-2.5 sm:p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-700">Captcha: Solve {captcha.question}</p>
                <button type="button" onClick={resetCaptcha} className="text-xs font-semibold text-blue-700 hover:underline">
                  Refresh
                </button>
              </div>
              <input
                type="number"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Enter answer"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 font-bold text-white transition hover:bg-red-700 disabled:opacity-50 sm:py-3"
            >
              {loading ? 'Please wait...' : 'Continue'}
            </button>
          </form>

          {isCustomerMode && (
            <>
              <div className="my-3 flex items-center gap-3 sm:my-5">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-500">OR</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {googleClientId ? (
                <div className="flex justify-center">
                  <div ref={googleBtnRef} />
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center">
                  Google auth requires `REACT_APP_GOOGLE_CLIENT_ID` in your environment.
                </p>
              )}
            </>
          )}

          {mode === 'staff-signin' && (
            <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 sm:mt-6 sm:pt-5">
              <p className="text-xs text-gray-600 text-center">Demo staff login</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => demoLogin('admin')}
                  className="bg-slate-100 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200"
                >
                  Admin Demo
                </button>
                <button
                  onClick={() => demoLogin('manager')}
                  className="bg-slate-100 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200"
                >
                  Manager Demo
                </button>
              </div>
            </div>
          )}

          {isCustomerMode && (
            <div className="mt-3 text-center text-sm text-slate-600 sm:mt-6">
              {mode === 'customer-signin' ? (
                <p>
                  New customer?{' '}
                  <Link to="/signup" className="font-semibold text-blue-700 hover:underline">
                    Sign up with email or Google
                  </Link>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <Link to="/login?mode=customer-signin" className="font-semibold text-blue-700 hover:underline">
                    Sign in
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 text-center sm:mt-6">
          <Link to="/" className="text-white hover:text-blue-100 transition font-semibold">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
