import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";

const Icons = {
  'username': CiUser,
  'email': MdOutlineEmail,
  'password': TbLockPassword
};

const TerminalInput = ({ id, name, type = 'text', value, onChange, onBlur, placeholder, error }) => {
  const [focused, setFocused] = useState(false);
  const Icon = Icons[name];

  return (
    <>
      <div className="relative w-full">
        {focused ? (
          <span
            className={`absolute left-3 top-1/2 w-3 h-6 ${error ? 'bg-[#FF002C]' : 'bg-[#00FFAB]'} rounded-sm -translate-y-1/2 animate-blink`}
            aria-hidden="true"
          />
        ) : (
          Icon && <Icon className="absolute left-3 top-1/2 text-white w-5 h-5 -translate-y-1/2" />
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={() => setFocused(true)}
          onBlurCapture={() => setFocused(false)}
          placeholder={placeholder}
          spellCheck={false}
          className={`w-full bg-[#161b22] text-[#00FFAB] font-mono border ${error ? 'border-red-500' : 'border-[#00FFAB]'
            } rounded-lg px-10 py-3 placeholder-[#3DF5F5] focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-[#00FFAB]'
            } caret-[#00FFAB] transition`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1 font-semibold animate-pulse">{error}</p>}
    </>
  );
};

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [validMap, setValidMap] = useState({ username: false, email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Register - CloudBench';
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        break;
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

  const handleBlur = (e) => {
    const { name, value } = e.target;
    updateValidation(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate all fields before submitting
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

    fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(false);
        if (data.status === 'success') {
          navigate('/auth/login');
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.error(err);
        toast('Failed: ' + err.message, {
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
          Register a new <span className="text-[#3DF5F5]">CloudBench</span> account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <label htmlFor="username" className="block text-[#3DF5F5] font-semibold mb-2">
              Username
            </label>
            <TerminalInput
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInput}
              onBlur={handleBlur}
              placeholder="Enter your username"
              error={errors.username}
            />
          </div>

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
              onBlur={handleBlur}
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
              onBlur={handleBlur}
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
            {submitting ? 'Registering...' : 'Sign Up'}
          </button>
          {!allValid && (
            <p className="text-xs text-[#3DF5F5] text-center -mt-5">
              Please fill all fields correctly to enable sign up.
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

export default Register;
