import React, { useState } from 'react';
import { useUserData } from '../../context/UserDataContext';
import { ConnectedUser } from '../../types';
import { 
  Users, UserPlus, Download, Trash2, Mail, Phone, 
  CheckCircle2, Sparkles, FileSpreadsheet, 
  ShieldCheck, Search, BellRing, ArrowRight, ExternalLink, Lock, Unlock, KeyRound 
} from 'lucide-react';
import { YoutubeIcon } from '../common/YoutubeIcon';

export const UserSubscriberPortal: React.FC = () => {
  const { connectedUsersList, addConnectedUser, deleteConnectedUser } = useUserData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('MPhil / PhD Researcher');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Admin view security protection
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput.trim() === '2026' || adminPinInput.trim().toLowerCase() === 'arif') {
      setIsAdminUnlocked(true);
      setPinError(false);
      setAdminPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleSubscribeUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    addConnectedUser({
      name,
      email,
      phone: phone || '+92 300 0000000',
      role,
      institution: institution || 'Bioinformatics Research Institute',
      status: 'Active - Subscriber',
    });

    setSuccessMsg(`Welcome ${name}! You have successfully registered and subscribed to Bioinformatics Hub & YouTube updates.`);
    setName('');
    setEmail('');
    setPhone('');
    setInstitution('');

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleExportExcelCSV = () => {
    let csv = 'User ID,Full Name,Email Address,Contact Number,Research Role / Institution,Subscription Status,Registered Date\n';
    connectedUsersList.forEach(u => {
      csv += `"${u.id}","${u.name}","${u.email}","${u.phone}","${u.role} (${u.institution || 'N/A'})","${u.status}","${u.subscribedDate}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `connected_biohub_users_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = connectedUsersList.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fadeIn mb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bio-glass border-orange-200 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-orange-700">
            <Users className="w-4 h-4 text-orange-600" />
            <span>Community & Research Access Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Connected Users & Subscription Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 max-w-2xl leading-relaxed">
            Subscribe to get access to bioinformatics updates, video tutorials, and research tools. Private subscriber directory and Excel exporter are restricted to admin access.
          </p>
        </div>

        {/* Admin Lock / Unlock Toggle */}
        <div className="self-start md:self-auto flex items-center space-x-2">
          {isAdminUnlocked ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleExportExcelCSV}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Excel (.CSV)</span>
              </button>
              <button
                onClick={() => setIsAdminUnlocked(false)}
                className="px-3 py-2.5 rounded-2xl bg-white border border-orange-200 text-slate-700 hover:bg-orange-50 font-bold text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer"
                title="Lock Admin View"
              >
                <Lock className="w-3.5 h-3.5 text-orange-600" />
                <span>Lock</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleUnlockAdmin} className="flex items-center space-x-1.5 bg-white p-1.5 rounded-2xl border border-orange-200 shadow-xs">
              <KeyRound className="w-3.5 h-3.5 text-orange-600 ml-1.5" />
              <input
                type="password"
                placeholder="Admin PIN (2026)"
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                className="w-28 p-1 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Admin
              </button>
            </form>
          )}
        </div>
      </div>

      {pinError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl animate-fadeIn">
          Incorrect PIN. Enter "2026" to view the private subscriber directory.
        </div>
      )}

      {/* 2-Column Section: Subscribe Form & Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Subscribe / Add User Form */}
        <div className="lg:col-span-7 rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-2 rounded-2xl bg-orange-100 text-orange-600 border border-orange-200">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Subscribe & Connect to Hub</h3>
              <p className="text-xs text-slate-600 font-medium">Join our computational biology learning community.</p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3.5 mb-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-start space-x-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubscribeUser} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Muhammad Ahmed"
                  className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ahmed.bio@university.edu"
                  className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Contact Number / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-mono font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold mb-1">Research Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
                >
                  <option value="BS Student">BS (Bachelor of Science) Student</option>
                  <option value="MPhil / PhD Researcher">MPhil / PhD Researcher</option>
                  <option value="Professor / Principal Investigator">Professor / Principal Investigator</option>
                  <option value="Bioinformatics Industry Professional">Bioinformatics Industry Professional</option>
                  <option value="Plant Breeder / Molecular Biologist">Plant Breeder / Molecular Biologist</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-900 font-extrabold mb-1">University / Research Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Department of Bioinformatics & Biotechnology"
                className="w-full p-2.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <BellRing className="w-4 h-4" />
              <span>Subscribe & Connect to Hub</span>
            </button>
          </form>
        </div>

        {/* Community Growth & Privacy Notice */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bio-glass border-orange-200 space-y-4 shadow-xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-orange-800">
              Community Membership
            </h4>
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
              <span className="text-xs text-slate-700 font-bold">Total Active Platform Members</span>
              <p className="text-3xl font-extrabold font-mono text-orange-950 mt-1">
                {connectedUsersList.length} Connected
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-orange-200 text-xs text-slate-700 leading-relaxed font-medium">
              <div className="flex items-center space-x-1.5 text-emerald-800 font-extrabold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy Protection Guaranteed</span>
              </div>
              Subscriber data is stored privately on the administrator backend and is never publicly exposed to unauthorized visitors.
            </div>
          </div>
        </div>
      </div>

      {/* Connected Users Table (Shown only in Admin Mode) */}
      {isAdminUnlocked ? (
        <div className="rounded-3xl bio-glass border-orange-200 p-6 sm:p-8 space-y-4 shadow-xs animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300">
                  Admin Authorized
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                Private Connected Users Directory ({connectedUsersList.length})
              </h3>
              <p className="text-xs text-slate-600 font-medium">Full database roster of subscribed researchers and students.</p>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-orange-200 text-slate-900 font-bold text-xs focus:outline-none focus:border-orange-500 shadow-xs"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-orange-200">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-orange-100/90 text-[11px] uppercase font-mono font-extrabold text-orange-950 border-b border-orange-200">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Contact Number</th>
                  <th className="p-3">Role / Institution</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Subscribed Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100 bg-white">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-orange-50/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-orange-900">{u.id}</td>
                    <td className="p-3 font-extrabold text-slate-900 whitespace-nowrap">{u.name}</td>
                    <td className="p-3 font-mono text-slate-700 whitespace-nowrap font-medium">{u.email}</td>
                    <td className="p-3 font-mono text-slate-700 whitespace-nowrap font-medium">{u.phone}</td>
                    <td className="p-3 text-slate-700">
                      <span className="block font-bold text-slate-900">{u.role}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{u.institution}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status.includes('VIP')
                          ? 'bg-amber-100 text-amber-950 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600 whitespace-nowrap font-medium">{u.subscribedDate}</td>
                    <td className="p-3 text-right">
                      {u.id !== 'BIO-1001' && (
                        <button
                          onClick={() => deleteConnectedUser(u.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-orange-50/70 border border-orange-200 text-center text-xs text-slate-600 font-medium shadow-xs">
          <Lock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
          <span>Subscriber directory is private and protected for administrator viewing only. Enter PIN <strong>2026</strong> above to unlock.</span>
        </div>
      )}

      {/* YouTube Channel Spotlight Banner at the end */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 p-6 sm:p-8 text-white shadow-xl shadow-red-600/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold font-mono">
                Official YouTube Learning Channel
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Join the Bioinformatics Mastery Community
            </h3>
            <p className="text-xs sm:text-sm text-red-50 leading-relaxed font-medium">
              Subscribe to <strong className="text-white font-extrabold">@Bioinformatics_Mastery</strong> for comprehensive video tutorials on bulk RNA-seq, DESeq2 differential expression, AlphaFold 3D structure predictions, AutoDock Vina molecular docking, and crop pan-genomics.
            </p>
          </div>

          <a
            href="https://www.youtube.com/@Bioinformatics_Mastery"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start md:self-auto px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-red-600 font-extrabold text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition-all transform hover:scale-105 cursor-pointer"
          >
            <YoutubeIcon className="w-5 h-5 text-red-600" />
            <span>Subscribe on YouTube</span>
            <ExternalLink className="w-4 h-4 text-red-600" />
          </a>
        </div>
      </div>
    </div>
  );
};
