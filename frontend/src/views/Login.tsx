import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Shield, Briefcase, Heart, Eye, EyeOff, ArrowRight, Globe, Leaf, HelpCircle, Chrome } from 'lucide-react';
import AuthSpinner from '../components/AuthSpinner';
import { getAuthSession, login, Role } from '../lib/auth';
import { validateLoginForm } from '../lib/authValidation';

const roles = [
  { id: 'volunteer', label: 'Volunteer', icon: Heart },
  { id: 'field', label: 'Field Worker', icon: Briefcase },
  { id: 'coordinator', label: 'Coordinator', icon: User },
  { id: 'admin', label: 'Admin', icon: Shield },
] as const;

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<Role>('coordinator');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberSession, setRememberSession] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const session = getAuthSession();
    if (session?.user.route) {
      navigate(session.user.route, { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationErrors = validateLoginForm({ identifier, password });
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setIsAuthenticating(true);

    try {
      const response = await login({
        identifier: identifier.trim(),
        password,
        role: selectedRole,
        rememberSession,
      });
      navigate(response.user.route || '/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setError('Google sign-in is disabled. Use email/username + password login.');
  };

  return (
    <>
      <AnimatePresence>
        {isAuthenticating && <AuthSpinner />}
      </AnimatePresence>
      
      <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Narrative/Brand Imagery */}
      <section className="hidden md:flex md:w-2/5 relative overflow-hidden bg-primary items-end p-12">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1920"
            alt="Community"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <span className="inline-block p-3 bg-secondary-container/20 rounded-xl mb-4">
                <Heart className="text-secondary-container w-6 h-6 fill-current" />
              </span>
              <blockquote className="text-3xl font-headline font-bold text-white leading-tight tracking-tight">
                "The strength of a community is its willingness to serve."
              </blockquote>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-12 bg-secondary"></div>
              <p className="text-surface-low font-medium text-sm tracking-widest uppercase">Grounded Wisdom</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Right Side: Content Canvas */}
      <section className="flex-1 bg-surface-low flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-xl mb-12 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="text-primary w-8 h-8 fill-current" />
            <span className="text-xl font-headline font-black tracking-tighter text-primary uppercase">GROUNDPULSE</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-on-surface-variant">
            <span>English (US)</span>
            <Globe className="w-4 h-4" />
          </div>
        </div>

        <div className="w-full max-w-xl">
          <header className="mb-10">
            <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant">Select your role to access the GroundPulse ecosystem.</p>
          </header>

          {/* Role Selection Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setSelectedRole(role.id);
                  setError('');
                }}
                className={`group flex flex-col items-center p-5 rounded-xl border-2 transition-all active:scale-95 ${
                  selectedRole === role.id
                    ? 'border-primary bg-surface-lowest shadow-md'
                    : 'border-transparent bg-surface-lowest hover:shadow-lg'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  selectedRole === role.id
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary-container/10 text-secondary'
                }`}>
                  <role.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-headline font-bold ${
                  selectedRole === role.id ? 'text-primary' : 'text-on-surface'
                }`}>
                  {role.label}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email or Username</label>
              <input
                type="text"
                placeholder="e.g. j.doe@groundpulse.org"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, identifier: undefined }));
                }}
                required
                className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
              />
              {fieldErrors.identifier && (
                <p className="text-xs font-medium text-red-600">{fieldErrors.identifier}</p>
              )}
            </div>
            <div className="space-y-1 relative">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                required
                className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3 text-on-surface-variant hover:text-primary"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {fieldErrors.password && (
                <p className="text-xs font-medium text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary-container"
                />
                <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface">Remember this session</span>
              </label>
              <a href="#" className="text-xs font-bold text-primary hover:text-secondary transition-colors">Forgot credentials?</a>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-4 rounded-xl font-headline font-bold text-white tracking-wide bg-gradient-to-r from-primary to-primary-container shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>Access Secure Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface-low px-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
              className="w-full py-3 rounded-xl font-headline font-bold text-on-surface tracking-wide bg-surface-lowest border border-outline-variant hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <Chrome className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>

            <p className="text-center text-sm text-on-surface-variant mt-6">
              New to GroundPulse?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Create an Account
              </Link>
            </p>
          </form>

          <footer className="mt-16 pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              GroundPulse Secure Auth Node v4.2.0
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs font-semibold text-on-surface-variant hover:text-primary flex items-center gap-1">
                <HelpCircle className="w-4 h-4" /> Support
              </a>
              <a href="#" className="text-xs font-semibold text-on-surface-variant hover:text-primary flex items-center gap-1">
                <Shield className="w-4 h-4" /> Legal
              </a>
            </div>
          </footer>
        </div>
      </section>
    </div>
    </>
  );
}
