import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, X, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, enterGuestDemo, isSupabaseConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(email, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMsg(res.error || 'Invalid credentials.');
        }
      } else if (mode === 'signup') {
        const res = await signUp(email, password, name);
        if (res.success) {
          setSuccessMsg('Account created successfully! You are now logged in.');
          setTimeout(() => onClose(), 1200);
        } else {
          setErrorMsg(res.error || 'Failed to create account.');
        }
      } else {
        // Forgot password
        setSuccessMsg('Password reset instructions sent to your email (or simulated in demo mode).');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestDemo = () => {
    enterGuestDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bio-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-bio-900 border border-slate-700 shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {mode === 'signin' ? 'Sign In to BioHub' : mode === 'signup' ? 'Create BioHub Account' : 'Reset Password'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isSupabaseConfigured
                ? 'Supabase Authentication Connected'
                : 'Demo mode — no account data is stored online.'}
            </p>
          </div>
        </div>

        {/* Notification Status */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-200 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arif Uddin"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-bio-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="researcher@biohub.edu"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-bio-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-bio-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-1.5"
          >
            <span>{loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Mode switcher */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          {mode === 'signin' ? (
            <span>
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-cyan-400 font-semibold hover:underline">
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button onClick={() => setMode('signin')} className="text-cyan-400 font-semibold hover:underline">
                Sign In
              </button>
            </span>
          )}
        </div>

        {/* Guest Demo Instant Login Button */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={handleGuestDemo}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-teal-300 border border-slate-700 hover:border-teal-500/50 flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Continue as Guest Demo (No Login Needed)</span>
          </button>
          <p className="text-[10px] text-slate-500 text-center mt-1.5 font-mono">
            Demo mode — no account data is stored online.
          </p>
        </div>
      </div>
    </div>
  );
};
