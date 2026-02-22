import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  const { login, signUpCustomer, signInCustomer, authWithGoogle } = useAuth();

  const [mode, setMode] = useState('customer-signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    <div className="min-h-screen bg-gradient-to-br from-primary to-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-4xl font-bold text-white mb-2">Elamshelf Access</h1>
          <p className="text-blue-100 text-base">Customer and staff authentication</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              onClick={() => setMode('customer-signin')}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${mode === 'customer-signin' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Customer Sign In
            </button>
            <button
              onClick={() => setMode('customer-signup')}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${mode === 'customer-signup' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Customer Sign Up
            </button>
            <button
              onClick={() => setMode('staff-signin')}
              className={`rounded-lg px-3 py-2 text-xs font-bold ${mode === 'staff-signin' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              Staff Login
            </button>
          </div>

          <h2 className="text-2xl font-bold text-primary mb-6">
            {mode === 'customer-signup' && 'Create Customer Account'}
            {mode === 'customer-signin' && 'Customer Sign In'}
            {mode === 'staff-signin' && 'Staff Sign In'}
          </h2>

          {(error || googleError) && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error || googleError}
            </div>
          )}

          <form onSubmit={currentSubmitHandler} className="space-y-4">
            {mode === 'customer-signup' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {mode === 'customer-signup' && (
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            )}

            <div className="rounded-lg border border-slate-300 bg-slate-50 p-3">
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
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Enter answer"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 'Continue'}
            </button>
          </form>

          {isCustomerMode && (
            <>
              <div className="my-5 flex items-center gap-3">
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
            <div className="mt-6 border-t border-gray-200 pt-5 space-y-2">
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
            <div className="mt-6 text-center text-sm text-slate-600">
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

        <div className="text-center mt-6">
          <Link to="/" className="text-white hover:text-blue-100 transition font-semibold">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
