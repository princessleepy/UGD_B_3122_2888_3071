'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const USER_EMAIL = "beni@gmail.com";
    const USER_PASSWORD = "beni123";
    const ADMIN_EMAIL = "admin@samudra.tech";
    const ADMIN_PASSWORD = "adminsuper123";
    
    let emailErr = '';
    let passwordErr = '';

    setErrors({ email: '', password: '' });

    if (!email) emailErr = "Email wajib diisi!";
    if (!password) passwordErr = "Password wajib diisi!";

    if (emailErr || passwordErr) {
      setErrors({ email: emailErr, password: passwordErr });
      return;
    }

    const isAdmin = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    const isUser = email === USER_EMAIL && password === USER_PASSWORD;

    if (isAdmin) {
      router.push('/admin');
    } else if (isUser) {
      router.push('/dashboard');
    } else {
      if (email !== ADMIN_EMAIL && email !== USER_EMAIL) {
        emailErr = "Email tidak terdaftar!";
      } else {
        passwordErr = "Password salah!";
      }
      setErrors({ email: emailErr, password: passwordErr });
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-mono p-6">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2000" 
          alt="Background"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-black/70 z-1"></div>
      </div>

      <div className="absolute w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] z-0 -top-10 -right-10"></div>

      <div className="relative z-10 w-full max-w-[460px] flex flex-col items-center">
        <div className="text-center mb-10 px-4">
          <h1 className="text-white text-lg font-bold tracking-[0.4em] uppercase opacity-90 drop-shadow-2xl leading-relaxed">
            PT. SAMUDRA TECHNOLOGY NUSANTARA
          </h1>
        </div>

        <div className="w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.7)] ring-1 ring-white/5">
          
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-white p-2 rounded-xl shadow-2xl">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl uppercase leading-none tracking-tighter">AQUALYNX</span>
              <span className="text-purple-400 text-[10px] font-medium tracking-[0.15em] mt-1 uppercase opacity-90">Maritime Analytics</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            
            <div className="group">
              <label className="text-white/40 text-[10px] font-bold mb-2 block uppercase tracking-widest ml-1 transition-colors group-focus-within:text-purple-400">
                &gt; Email
              </label>
              <div className="relative">
                <span className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 ${errors.email ? 'text-red-500' : 'text-gray-500 group-focus-within:text-purple-400'}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@samudra.tech"
                  className={`w-full bg-white/5 border-2 text-white py-4 pl-14 pr-6 rounded-xl focus:outline-none transition-all duration-300 text-sm
                    ${errors.email ? 'border-red-500/40 bg-red-500/5 focus:border-red-500' : 'border-white/5 focus:border-purple-500/40 focus:bg-white/10'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-[9px] mt-2 ml-1 font-bold uppercase tracking-tighter">{errors.email}</p>}
            </div>

            <div className="group">
              <label className="text-white/40 text-[10px] font-bold mb-2 block uppercase tracking-widest ml-1 transition-colors group-focus-within:text-purple-400">
                &gt; Password
              </label>
              <div className="relative">
                <span className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 ${errors.password ? 'text-red-500' : 'text-gray-500 group-focus-within:text-purple-400'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className={`w-full bg-white/5 border-2 text-white py-4 pl-14 pr-14 rounded-xl focus:outline-none transition-all duration-300 text-sm
                    ${errors.password ? 'border-red-500/40 bg-red-500/5 focus:border-red-500' : 'border-white/5 focus:border-purple-500/40 focus:bg-white/10'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[9px] mt-2 ml-1 font-bold uppercase tracking-tighter">{errors.password}</p>}
            </div>

            <button 
              type="submit" 
              className="group relative w-full h-[54px] overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.98] shadow-[0_10px_30px_rgba(147,51,234,0.2)] mt-4 bg-purple-600 hover:bg-purple-500"
            >
              <span className="relative text-white font-bold uppercase tracking-[0.2em] text-xs">
                LOGIN
              </span>
            </button>
          </form>

          <div className="mt-12 text-center">
            <span className="text-white/20 text-[10px] tracking-[0.1em] block font-medium">
              SYSTEM VERSION 2.0.26 // STN MARITIME
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}