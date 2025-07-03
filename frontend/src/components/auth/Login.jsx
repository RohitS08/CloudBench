import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../util/authContext';
import { useLogin } from '../../util/isLoggedin';
import { toast } from 'react-hot-toast';

const TerminalInput = ({ id, name, type = 'text', value, onChange, placeholder, error }) => {
  const [focused, setFocused] = useState(false);

  return (
    <>
      <div className="relative w-full">
        {focused && (
          <span
            className={`absolute left-3 top-1/2 w-3 h-6 ${error ? 'bg-[#FF002C]' : 'bg-[#00FFAB]'} rounded-sm -translate-y-1/2 animate-blink`}
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          spellCheck={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-[#161b22] text-[#00FFAB] font-mono border ${error ? 'border-red-500' : 'border-[#00FFAB]'
            } rounded-lg px-10 py-3 placeholder-[#3DF5F5] focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-[#00FFAB]'
            } caret-[#00FFAB] transition`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1 font-semibold animate-pulse">{error}</p>}
    </>
  );
};

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [validMap, setValidMap] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const { setIsLoggedIn } = useLogin();

  useEffect(() => {
    document.title = 'Login - CloudBench';
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        break;
      default:
        return '';
    }
    return '';
  };

  const updateValidation = (name, value) => {
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    setValidMap((prev) => {
      const isValid = errorMsg === '';
      if (prev[name] !== isValid) {
        return { ...prev, [name]: isValid };
      }
      return prev;
    });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    updateValidation(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const errMsg = validateField(key, value);
      if (errMsg) newErrors[key] = errMsg;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(false);
        if (data.status === 'success') {
          setAccessToken(data.accessToken);
          setIsLoggedIn(true);
          navigate('/');
        } else {
          toast('Invalid Credentials!', {
            duration: 1500,
            icon: '⚡️'
          });
        }
      })
      .catch((err) => {
        setSubmitting(false);
        toast(`Failed: ${err.message}`, {
          duration: 1500,
          icon: '⚡️'
        });
      });
  };

  const allValid = Object.values(validMap).every(Boolean);

  return (
    <div className="flex-grow bg-[#0d1117] py-20 min-h-screen flex items-center justify-center font-mono">
      <div className="w-full max-w-md bg-[#161b22] rounded-3xl p-10 border border-[#2ea043] shadow-inner shadow-[#00FFAB]/30">
        <h1 className="text-[#00FFAB] text-3xl font-bold mb-8 text-center tracking-wide">
          Sign in to your <span className="text-[#3DF5F5]">CloudBench</span> account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <label htmlFor="email" className="block text-[#3DF5F5] font-semibold mb-2">
              Email
            </label>
            <TerminalInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInput}
              placeholder="you@example.com"
              error={errors.email}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#3DF5F5] font-semibold mb-2">
              Password
            </label>
            <TerminalInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInput}
              placeholder="••••••••"
              error={errors.password}
            />
          </div>

          <button
            type="submit"
            disabled={!allValid || submitting}
            className={`w-full ${allValid ? 'bg-[#2ea043]' : 'bg-[#2ea043]/40'
              } text-[#0d1117] font-bold text-xl py-3 rounded-xl shadow-md transition tracking-wide ${(!allValid || submitting) ? 'cursor-not-allowed opacity-60' : 'hover:bg-[#3DF5F5]'
              }`}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
          {!allValid && (
            <p className="text-xs text-[#3DF5F5] text-center -mt-5">
              Please fill all fields correctly to enable sign-in.
            </p>
          )}
        </form>
      </div>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s steps(1) infinite;
        }
      `}</style>
    </div>
  );
}

export default Login;
