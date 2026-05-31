'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  
  const [attempts, setAttempts] = useState(3);
  const [isLocked, setIsLocked] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (cooldown === 0 && isLocked) {
      setIsLocked(false);
      setAttempts(3);
      setErrors({ email: '', password: '' });
    }
  }, [cooldown, isLocked]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

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
      document.cookie = "isLoggedIn=true; path=/";
      document.cookie = "role=admin; path=/";

      router.push('/admin');
    } else if (isUser) {
      document.cookie = "isLoggedIn=true; path=/";
      document.cookie = "role=user; path=/";

      router.push('/dashboard');
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);

      if (newAttempts <= 0) {
        setIsLocked(true);
        setCooldown(10);
        setErrors({ email: "Email tidak terdaftar!", password: "Password salah!" });
      } else {
        if (email !== ADMIN_EMAIL && email !== USER_EMAIL) {
          emailErr = "Email tidak terdaftar!";
        } else {
          passwordErr = "Password salah!";
        }
        setErrors({ email: emailErr, password: passwordErr });
      }
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-mono p-6">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=2000" alt="Background" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-black/70 z-1"></div>
      </div>

      <div className="relative z-10 w-full max-w-[460px] flex flex-col items-center">
        <div className="text-center mb-10 px-4">
          <h1 className="text-white text-lg font-bold tracking-[0.4em] uppercase opacity-90 drop-shadow-2xl leading-relaxed">
            PT. SAMUDRA TECHNOLOGY NUSANTARA
          </h1>
        </div>

        <div className="w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.7)] ring-1 ring-white/5">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden w-14 h-14 flex items-center justify-center">
              <img src="/samudratech logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl uppercase leading-none tracking-tighter">SAMUDRA TECHNOLOGY NUSANTARA</span>
              <span className="text-purple-400 text-[10px] font-medium tracking-[0.15em] mt-1 uppercase opacity-90">Maritime Analytics</span>
            </div>
          </div>

          {!isLocked && (
            <div className="mb-6 text-amber-500 text-[10px] font-bold uppercase tracking-widest text-center">
              Sisa kesempatan login: {attempts}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="group">
              <label className="text-white/40 text-[10px] font-bold mb-2 block uppercase tracking-widest ml-1">&gt; Email</label>
              <input type="email" value={email} disabled={isLocked} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border-2 border-white/5 text-white py-4 px-6 rounded-xl focus:outline-none transition-all text-sm" />
              {errors.email && <p className="text-red-500 text-[9px] mt-2 ml-1 font-bold uppercase">{errors.email}</p>}
            </div>

            <div className="group relative">
              <label className="text-white/40 text-[10px] font-bold mb-2 block uppercase tracking-widest ml-1">&gt; Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                disabled={isLocked} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-white/5 border-2 border-white/5 text-white py-4 px-6 rounded-xl focus:outline-none transition-all text-sm pr-12" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[35px] text-gray-400 hover:text-white transition-colors">
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
              {errors.password && <p className="text-red-500 text-[9px] mt-2 ml-1 font-bold uppercase">{errors.password}</p>}
            </div>

            {isLocked && (
              <p className="text-red-500 text-[10px] font-bold uppercase text-center animate-pulse">
                Terlalu banyak percobaan. Mohon menunggu {cooldown} detik.
              </p>
            )}

            <button type="submit" disabled={isLocked} className={`w-full h-[54px] rounded-xl font-bold uppercase transition-all ${isLocked ? 'bg-gray-700 cursor-not-allowed opacity-50' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}>
              LOGIN
            </button>
          </form>

          <div className="mt-12 text-center">
            <span className="text-white/20 text-[10px] tracking-[0.1em] block font-medium">SYSTEM VERSION 2.0.26 // STN MARITIME</span>
          </div>
        </div>
      </div>
    </main>
  );
}