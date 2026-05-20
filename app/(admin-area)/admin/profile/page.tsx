'use client';

import { robotoMono } from '@/app/ui/fonts';
import { users } from '@/app/lib/admin-data';
import { UserCircleIcon, ShieldCheckIcon, Cog6ToothIcon, KeyIcon, XMarkIcon, BellIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function ProfilePage() {
  const user = users[0];

  const [openPassword, setOpenPassword] = useState(false);
  const [openPreferences, setOpenPreferences] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [notifEnabled, setNotifEnabled] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [language, setLanguage] = useState('english');

  const handleSavePassword = () => {
    if (!newPassword || !confirmPassword) return alert('Please fill all fields.');
    if (newPassword !== confirmPassword) return alert('Passwords do not match.');
    alert('Password updated successfully!');
    setOpenPassword(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSavePreferences = () => {
    alert('Preferences saved!');
    setOpenPreferences(false);
  };

  return (
    <div className={`min-h-screen bg-transparent text-white p-6 ${robotoMono.className}`}>
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-widest">Profile</h1>
        <p className="text-[11px] text-gray-400 mt-1">
          View and manage your admin account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1a0b2e]/80 border border-white/5 rounded-2xl p-6">
            <h2 className="text-[12px] tracking-widest text-gray-400 mb-6 uppercase">
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <UserCircleIcon className="w-5 text-[#d095ff]" />
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">Full Name</p>
                  <p className="text-sm font-semibold">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <KeyIcon className="w-5 text-[#d095ff]" />
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">Email</p>
                  <p className="text-sm font-semibold">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <ShieldCheckIcon className="w-5 text-[#d095ff]" />
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">Role</p>
                  <p className="text-sm font-semibold">System Administrator</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <Cog6ToothIcon className="w-5 text-[#d095ff]" />
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">Company</p>
                  <p className="text-sm font-semibold">PT. Samudra Technology Nusantara</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a0b2e]/80 border border-white/5 rounded-2xl p-6">
            <h2 className="text-[12px] tracking-widest text-gray-400 mb-6 uppercase">
              Security Settings
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <p className="text-sm">Change Password</p>
                  <p className="text-[10px] text-gray-400">Update your account password</p>
                </div>
                <button
                  onClick={() => setOpenPassword(true)}
                  className="text-[#d095ff] text-[10px] font-bold hover:text-purple-300 transition-colors"
                >
                  UPDATE
                </button>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                <div>
                  <p className="text-sm">Preferences</p>
                  <p className="text-[10px] text-gray-400">Customize your dashboard</p>
                </div>
                <button
                  onClick={() => setOpenPreferences(true)}
                  className="text-[#d095ff] text-[10px] font-bold hover:text-purple-300 transition-colors"
                >
                  CONFIGURE
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a0b2e]/80 border border-white/5 rounded-2xl p-6">
            <h2 className="text-[12px] tracking-widest text-gray-400 mb-4 uppercase">
              Admin Privileges
            </h2>
            <div className="space-y-3 text-sm text-gray-300">
              {["User Management", "Port Assignment", "Shift Control", "Access Control", "System Settings"].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a0b2e]/80 border border-white/5 rounded-2xl p-6">
            <h2 className="text-[12px] tracking-widest text-gray-400 mb-4 uppercase">
              Activity Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Last Login</span>
                <span>Today, 09:30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Users Managed</span>
                <span>{users.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Sessions</span>
                <span>1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`bg-[#1a0b2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl ${robotoMono.className}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold tracking-widest">Change Password</h3>
              <button onClick={() => setOpenPassword(false)} className="text-gray-400 hover:text-white">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d095ff] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-[10px]"
                  >
                    {showNew ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d095ff] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-[10px]"
                  >
                    {showConfirm ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSavePassword}
                className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[11px] font-bold py-3 rounded-xl transition-colors tracking-widest"
              >
                SAVE
              </button>
              <button
                onClick={() => setOpenPassword(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-3 rounded-xl transition-colors tracking-widest"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {openPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`bg-[#1a0b2e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl ${robotoMono.className}`}>
            <div className="flex justify-between items-center mb-1">
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase">Preferences</h3>
                <p className="text-[9px] text-gray-500 mt-0.5 tracking-widest">SYSTEM CONFIGURATION NODE: 0X442A</p>
              </div>
              <button onClick={() => setOpenPreferences(false)} className="text-gray-400 hover:text-white">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-0.5 h-4 bg-[#7c3aed] rounded-full" />
                <BellIcon className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] tracking-widest text-gray-300 uppercase">Notification Settings</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5">
                  <div>
                    <p className="text-[11px] font-semibold">Enable Notifications</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Master switch for system-wide alerts</p>
                  </div>
                  <button
                    onClick={() => setNotifEnabled(!notifEnabled)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${notifEnabled ? 'bg-[#7c3aed]' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${notifEnabled ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>

                <div className="flex justify-between items-center bg-white/5 rounded-xl p-4 border border-white/5">
                  <div>
                    <p className="text-[11px] font-semibold">System Alerts</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Critical updates and infrastructure status</p>
                  </div>
                  <button
                    onClick={() => setSystemAlerts(!systemAlerts)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${systemAlerts ? 'bg-[#7c3aed]' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${systemAlerts ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-0.5 h-4 bg-[#7c3aed] rounded-full" />
                <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] tracking-widest text-gray-300 uppercase">Language Settings</span>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2">Interface Language</p>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#0f0720] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d095ff] appearance-none cursor-pointer"
                >
                  <option value="english">English</option>
                  <option value="indonesia">Indonesia</option>
                </select>
                <p className="text-[9px] text-purple-400 mt-2">Language changes apply globally across all pages</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setOpenPreferences(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-3 rounded-xl transition-colors tracking-widest"
              >
                CANCEL
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[11px] font-bold py-3 rounded-xl transition-colors tracking-widest"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}