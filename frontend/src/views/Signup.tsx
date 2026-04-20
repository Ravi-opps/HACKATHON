import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Briefcase, Heart, Eye, EyeOff, ArrowRight, Leaf, MapPin, Phone, Mail, ShieldCheck, Chrome } from 'lucide-react';
import { signup } from '../lib/auth';
import { SignupFormErrors, validateSignupForm } from '../lib/authValidation';

const roles = [
  { id: 'volunteer', label: 'Volunteer', icon: Heart, description: 'General support and community aid' },
  { id: 'field', label: 'Field Worker', icon: Briefcase, description: 'Specialized response and logistics' },
] as const;

const zones = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'central', label: 'Central' },
];

const professions = [
  { value: 'student', label: 'Student' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'other', label: 'Other' },
];

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState<'volunteer' | 'field'>('volunteer');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<SignupFormErrors>({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    zone: 'north',
    profession: 'student',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationErrors = validateSignupForm(
      {
        ...formData,
        role: selectedRole,
      },
      zones.map((zone) => zone.value),
      professions.map((profession) => profession.value)
    );
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        zone: formData.zone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: selectedRole,
        profession: selectedRole === 'volunteer' ? formData.profession : undefined,
      });
      navigate(response.user.route || '/login', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setError('Google sign-up is disabled. Create your account with the form.');
  };

  return (
    <div className="min-h-screen bg-surface-low flex flex-col lg:flex-row">
      {/* Left Side: Branding & Info */}
      <section className="hidden lg:flex lg:w-1/3 bg-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Leaf className="text-white w-10 h-10 fill-current" />
            <span className="text-2xl font-headline font-black tracking-tighter text-white uppercase">GROUNDPULSE</span>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-4xl font-headline font-extrabold text-white leading-tight">
              Join the Frontline of Hope.
            </h2>
            <p className="text-primary-container text-lg leading-relaxed">
              Your skills and dedication can save lives. Create an account to join our coordinated humanitarian response network.
            </p>
            
            <div className="space-y-6 pt-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="text-white w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Verified Network</h4>
                  <p className="text-primary-container text-sm">Join a trusted community of responders.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Local Impact</h4>
                  <p className="text-primary-container text-sm">Respond to needs in your specific zone.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 pt-12 border-t border-white/10">
          <p className="text-xs text-primary-container font-medium uppercase tracking-widest">
            GroundPulse Humanitarian Node v4.2.0
          </p>
        </div>
      </section>

      {/* Right Side: Signup Form */}
      <section className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-2xl">
          <header className="mb-10">
            <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Create Your Profile</h1>
            <p className="text-on-surface-variant">Step into your role as a responder.</p>
          </header>

          <form onSubmit={handleSignup} className="space-y-8">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Select Your Primary Role</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setFieldErrors((prev) => ({ ...prev, profession: undefined }));
                    }}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedRole === role.id
                        ? 'border-primary bg-surface-lowest shadow-md'
                        : 'border-transparent bg-surface-lowest hover:shadow-lg'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      selectedRole === role.id ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      <role.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${selectedRole === role.id ? 'text-primary' : 'text-on-surface'}`}>
                        {role.label}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant mt-1 leading-tight">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ravi Kumar"
                  value={formData.fullName}
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
                  onChange={(e) => {
                    setFormData({...formData, fullName: e.target.value});
                    setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                />
                {fieldErrors.fullName && (
                  <p className="text-xs font-medium text-red-600">{fieldErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Professional Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="ravi.k@groundpulse.org"
                  value={formData.email}
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                />
                {fieldErrors.email && (
                  <p className="text-xs font-medium text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Contact Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+919876543210"
                  value={formData.phone}
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
                  onChange={(e) => {
                    setFormData({...formData, phone: e.target.value});
                    setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                />
                {fieldErrors.phone && (
                  <p className="text-xs font-medium text-red-600">{fieldErrors.phone}</p>
                )}
              </div>

              {/* Zone */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Operational Zone
                </label>
                <select
                  value={formData.zone}
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm appearance-none"
                  onChange={(e) => {
                    setFormData({...formData, zone: e.target.value});
                    setFieldErrors((prev) => ({ ...prev, zone: undefined }));
                  }}
                >
                  {zones.map(zone => (
                    <option key={zone.value} value={zone.value}>{zone.label}</option>
                  ))}
                </select>
                {fieldErrors.zone && (
                  <p className="text-xs font-medium text-red-600">{fieldErrors.zone}</p>
                )}
              </div>

              {/* Profession (Conditional for Volunteers) */}
              {selectedRole === 'volunteer' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Area of Expertise
                  </label>
                  <select
                    value={formData.profession}
                    className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm appearance-none"
                    onChange={(e) => {
                      setFormData({...formData, profession: e.target.value});
                      setFieldErrors((prev) => ({ ...prev, profession: undefined }));
                    }}
                  >
                    {professions.map(prof => (
                      <option key={prof.value} value={prof.value}>{prof.label}</option>
                    ))}
                  </select>
                  {fieldErrors.profession && (
                    <p className="text-xs font-medium text-red-600">{fieldErrors.profession}</p>
                  )}
                </div>
              )}

              {/* Password */}
              <div className="space-y-1 relative">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Secure Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
                  onChange={(e) => {
                    setFormData({...formData, confirmPassword: e.target.value});
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-xs font-medium text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-headline font-bold text-white tracking-wide bg-gradient-to-r from-primary to-primary-container shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Initialize Responder Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {error && (
                <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
              )}

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/30"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-surface-low px-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl font-headline font-bold text-on-surface tracking-wide bg-surface-lowest border border-outline-variant hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
              >
                <Chrome className="w-4 h-4" />
                <span>Continue with Google</span>
              </button>
               
              <p className="text-center mt-6 text-sm text-on-surface-variant">
                Already part of the network?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
