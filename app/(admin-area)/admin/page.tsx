'use client';

import { robotoMono } from '@/app/ui/fonts';
import { UserIcon, UsersIcon, UserMinusIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { users, ports } from '@/app/lib/admin-data';

export default function AdminDashboardPage() {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'ACTIVE').length;
  const inactiveUsers = users.filter(u => u.status === 'INACTIVE').length;
  const totalPorts = ports.length;

  const activeSessions = activeUsers - 1;

  return (
    <div className={`min-h-screen bg-[#0d0415] text-white p-6 ${robotoMono.className}`}>

      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-widest">Admin Dashboard</h1>
        <p className="text-[11px] text-gray-400 mt-1">
          User & Access Management System
        </p>
        <p className="text-[9px] text-[#d095ff] tracking-widest mt-1 uppercase">
          PT. SAMUDRA TECHNOLOGY NUSANTARA
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        {[
          { label: "Total Users", value: totalUsers, icon: <UsersIcon className="w-5" /> },
          { label: "Active Users", value: activeUsers, icon: <UserIcon className="w-5" /> },
          { label: "Inactive Users", value: inactiveUsers, icon: <UserMinusIcon className="w-5" /> },
          { label: "Total Ports", value: totalPorts, icon: <BuildingOffice2Icon className="w-5" /> },
        ].map((item, i) => (
          <div key={i} className="bg-[#1a0b2e]/80 backdrop-blur-md p-6 rounded-[20px] border border-white/5">

            <div className="w-10 h-10 rounded-xl bg-[#d095ff]/10 flex items-center justify-center text-[#d095ff] mb-4">
              {item.icon}
            </div>

            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
              {item.label}
            </p>

            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-[#1a0b2e]/80 p-6 rounded-[24px] border border-white/5">

          <h2 className="text-[13px] font-extrabold tracking-[0.25em] uppercase mb-6">
            Recent Activity
          </h2>

          <div className="space-y-6">

            {[...users].reverse().slice(0, 5).map((user, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#d095ff]" />
                <div>
                  <p className="text-[12px] text-white font-medium">
                    {user.name} assigned to {ports.find(p => p.id === user.port_id)?.name}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Shift {user.shift} • {user.status}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>

        <div className="bg-[#1a0b2e]/80 p-6 rounded-[24px] border border-white/5">

          <h2 className="text-[13px] font-extrabold tracking-[0.25em] uppercase mb-6">
            System Overview
          </h2>

          <div className="space-y-4 text-[11px]">

            <div className="flex justify-between">
              <span className="text-gray-400">System Status</span>
              <span className="text-emerald-400 font-bold">Operational</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Active Sessions</span>
              <span className="font-bold">{activeSessions}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Last Sync</span>
              <span className="font-bold">5 min ago</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}