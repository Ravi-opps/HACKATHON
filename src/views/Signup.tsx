import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Briefcase, Heart, Eye, EyeOff, ArrowRight, Leaf, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

const roles = [
  { id: 'volunteer', label: 'Volunteer', icon: Heart, description: 'General support and community aid' },
  { id: 'field', label: 'Field Worker', icon: Briefcase, description: 'Specialized response and logistics' },
];

const zones = ['Kukatpally', 'Miyapur', 'Jubilee Hills', 'Secunderabad', 'Gachibowli', 'Hitech City'];

const professions = [
  'Medical',
  'Food & Nutrition',
  'Transportation',
  'Shelter & Housing',
  'Mental Health Support',
  'Legal Assistance',
  'Education & Tutoring',
  'Childcare',
  'Translation Services',
  'Other'
];

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState('volunteer');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    zone: 'Kukatpally',
    profession: 'Medical',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate and send to API
    localStorage.setItem('userRole', selectedRole);
    if (selectedRole === 'volunteer') navigate('/map');
    else navigate('/reports');
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
                    onClick={() => setSelectedRole(role.id)}
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
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
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
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Contact Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              {/* Zone */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Operational Zone
                </label>
                <select
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm appearance-none"
                  onChange={(e) => setFormData({...formData, zone: e.target.value})}
                >
                  {zones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              {/* Profession (Conditional for Volunteers) */}
              {selectedRole === 'volunteer' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Area of Expertise
                  </label>
                  <select
                    className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm appearance-none"
                    onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  >
                    {professions.map(prof => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1 relative">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Secure Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-3 text-on-surface-variant hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface-container border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-all px-4 py-3 rounded-t-lg text-sm"
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-headline font-bold text-white tracking-wide bg-gradient-to-r from-primary to-primary-container shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Initialize Responder Profile</span>
                <ArrowRight className="w-4 h-4" />
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
