import React, { useState, useEffect } from 'react';
import {
  Lock, LogOut, LayoutDashboard, MessageSquare, Briefcase, CreditCard,
  FileText, CheckCircle2, XCircle, AlertCircle, Search, Filter, Plus,
  Download, ArrowRight, RefreshCw, Key, Shield, User, ExternalLink, Eye, Layers, Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { downloadInvoicePDF, downloadReceiptPDF } from '../utils/pdfGenerator';
import type { Enquiry, Project, PaymentTransaction, Invoice, Receipt, AdminStats } from '../types';
import { AdminCMS } from '../components/AdminCMS';
import { WebsiteImagesManager } from '../components/WebsiteImagesManager';

export const AdminPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('gf_admin_token'));
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'cms' | 'banners' | 'enquiries' | 'projects' | 'payments' | 'invoices' | 'settings'>('overview');

  // Dashboard Data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Enquiries filter & search
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryFilterStatus, setEnquiryFilterStatus] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [convertingEnquiry, setConvertingEnquiry] = useState<Enquiry | null>(null);
  const [convertForm, setConvertForm] = useState({
    projectName: '',
    agreedAmount: '150000',
    startDate: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  });

  // Project Modal
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    clientName: '',
    contactEmail: '',
    contactPhone: '',
    projectName: '',
    services: 'Branding & Packaging',
    agreedAmount: '120000',
    startDate: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: 'In Progress' as Project['status'],
    internalNotes: ''
  });

  // Rejection modal
  const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Transaction reference not found in commercial bank account statement.');

  // Password Update
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Check existing session
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('gf_admin_token');
      if (!savedToken) {
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` }
        });
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setToken(savedToken);
          setUser(data.user);
        } else {
          localStorage.removeItem('gf_admin_token');
          setToken(null);
        }
      } catch (err) {
        localStorage.removeItem('gf_admin_token');
        setToken(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    verifyToken();
  }, []);

  // Fetch admin data when logged in
  const fetchAllData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resOverview, resEnq, resProj, resPay, resInv, resRec] = await Promise.all([
        fetch('/api/admin/overview', { headers }),
        fetch('/api/admin/enquiries', { headers }),
        fetch('/api/admin/projects', { headers }),
        fetch('/api/admin/payments', { headers }),
        fetch('/api/admin/invoices', { headers }),
        fetch('/api/admin/receipts', { headers })
      ]);

      if (resOverview.status === 401) {
        handleLogout();
        return;
      }

      const [dataOverview, dataEnq, dataProj, dataPay, dataInv, dataRec] = await Promise.all([
        resOverview.json(),
        resEnq.json(),
        resProj.json(),
        resPay.json(),
        resInv.json(),
        resRec.json()
      ]);

      if (dataOverview.stats) setStats(dataOverview.stats);
      if (dataEnq.enquiries) setEnquiries(dataEnq.enquiries);
      if (dataProj.projects) setProjects(dataProj.projects);
      if (dataPay.payments) setPayments(dataPay.payments);
      if (dataInv.invoices) setInvoices(dataInv.invoices);
      if (dataRec.receipts) setReceipts(dataRec.receipts);
    } catch (err) {
      console.error('Failed to load admin records:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid owner credentials.');
      }

      localStorage.setItem('gf_admin_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication error.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    localStorage.removeItem('gf_admin_token');
    setToken(null);
    setUser(null);
  };

  // Enquiry status change
  const handleUpdateEnquiryStatus = async (id: string, status: Enquiry['status'], notes?: string) => {
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, internalNotes: notes })
      });
      if (res.ok) {
        fetchAllData();
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry(prev => prev ? { ...prev, status, internalNotes: notes || prev.internalNotes } : null);
        }
      }
    } catch (err) {
      console.error('Failed to update enquiry:', err);
    }
  };

  // Convert Enquiry to Project
  const handleConvertEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingEnquiry) return;

    try {
      const res = await fetch(`/api/admin/enquiries/${convertingEnquiry.id}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          projectName: convertForm.projectName || `${convertingEnquiry.service} for ${convertingEnquiry.company || convertingEnquiry.name}`,
          services: [convertingEnquiry.service],
          agreedAmount: Number(convertForm.agreedAmount),
          startDate: convertForm.startDate,
          deadline: convertForm.deadline
        })
      });

      if (res.ok) {
        setConvertingEnquiry(null);
        fetchAllData();
        setActiveTab('projects');
      }
    } catch (err) {
      console.error('Failed to convert enquiry:', err);
    }
  };

  // Create Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProjectForm,
          agreedAmount: Number(newProjectForm.agreedAmount)
        })
      });

      if (res.ok) {
        setShowNewProjectModal(false);
        setNewProjectForm({
          clientName: '',
          contactEmail: '',
          contactPhone: '',
          projectName: '',
          services: 'Branding & Packaging',
          agreedAmount: '120000',
          startDate: new Date().toISOString().split('T')[0],
          deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          status: 'In Progress',
          internalNotes: ''
        });
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  // Verify Payment
  const handleVerifyPayment = async (paymentId: string) => {
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to verify payment:', err);
    }
  };

  // Reject Payment
  const handleRejectPayment = async () => {
    if (!rejectingPaymentId) return;
    try {
      const res = await fetch(`/api/admin/payments/${rejectingPaymentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      if (res.ok) {
        setRejectingPaymentId(null);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to reject payment:', err);
    }
  };

  // Update Credentials
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    try {
      const res = await fetch('/api/auth/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }
      setPasswordMsg({ text: 'Owner credentials updated successfully.', success: true });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordMsg({ text: err.message, success: false });
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5]">
        <div className="w-10 h-10 border-4 border-[#123578]/20 border-t-[#ED650B] rounded-full animate-spin" />
      </div>
    );
  }

  // 1. LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#F7F7F5] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E6E8ED] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#123578] text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7 text-[#ED650B]" />
            </div>
            <h1 className="text-2xl font-black text-[#123578]">Owner Console</h1>
            <p className="text-xs text-[#242832]/70">
              Secure administrative access for Goodfolk Solution leadership.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#123578] mb-1.5">
                Owner Email
              </label>
              <input
                type="email"
                required
                placeholder="akshay@goodfolksolution.in"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E6E8ED] text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123578]/20 focus:border-[#123578]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#123578] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E6E8ED] text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123578]/20 focus:border-[#123578]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#123578] hover:bg-[#0d285b] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4 text-[#ED650B]" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#E6E8ED] text-center">
            <span className="text-[11px] text-[#242832]/60">
              Protected by server-side scrypt/pbkdf2 hashing & rate limiting.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch =
      e.name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.company.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.email.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.id.toLowerCase().includes(enquirySearch.toLowerCase());
    const matchesStatus = enquiryFilterStatus === 'All' || e.status === enquiryFilterStatus;
    return matchesSearch && matchesStatus;
  });

  // 2. AUTHENTICATED DASHBOARD
  return (
    <div className="pt-24 pb-20 bg-[#F7F7F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8ED] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#123578] text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 text-[#ED650B]" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#123578]">
                Goodfolk Solution Admin Console
              </h1>
              <p className="text-xs text-[#242832]/60">
                Logged in as <strong>{user?.name || 'Akshay'}</strong> ({user?.email}) · Direct UPI: <span className="font-mono text-[#ED650B]">9817961412@ibl</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              disabled={loadingData}
              className="p-2.5 rounded-xl border border-[#E6E8ED] bg-[#F7F7F5] hover:bg-[#EEF2F9] text-[#123578] transition-colors"
              title="Refresh records"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'cms', label: 'Website CMS & Portfolio', icon: Layers },
            { id: 'banners', label: 'Website Banners & Images', icon: ImageIcon },
            { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: MessageSquare },
            { id: 'projects', label: `Projects (${projects.length})`, icon: Briefcase },
            { id: 'payments', label: `UPI Payments (${payments.length})`, icon: CreditCard },
            { id: 'invoices', label: `Invoices & Receipts (${invoices.length + receipts.length})`, icon: FileText },
            { id: 'settings', label: 'Security & Settings', icon: Key }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#173B75] text-white shadow-md'
                    : 'bg-white text-[#252A34]/80 border border-[#E6E8ED] hover:bg-[#EEF2F9]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F07822]' : 'text-[#173B75]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB A: OVERVIEW */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E6E8ED] shadow-sm">
                <span className="text-[11px] font-bold text-[#242832]/60 uppercase tracking-wider block">
                  Total Enquiries
                </span>
                <span className="text-2xl font-black text-[#123578] mt-1 block">
                  {stats.totalEnquiries}
                </span>
                <span className="text-[10px] text-[#242832]/60 mt-0.5 block">
                  {stats.newEnquiries} awaiting review
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6E8ED] shadow-sm">
                <span className="text-[11px] font-bold text-[#242832]/60 uppercase tracking-wider block">
                  Active Projects
                </span>
                <span className="text-2xl font-black text-[#123578] mt-1 block">
                  {stats.activeProjects}
                </span>
                <span className="text-[10px] text-[#242832]/60 mt-0.5 block">
                  {stats.completedProjects} delivered
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6E8ED] shadow-sm">
                <span className="text-[11px] font-bold text-[#242832]/60 uppercase tracking-wider block">
                  Verified Payments
                </span>
                <span className="text-2xl font-black text-[#25D366] mt-1 block">
                  ₹{stats.totalPaymentsReceived.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#242832]/60 mt-0.5 block">
                  Confirmed bank deposits
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6E8ED] shadow-sm">
                <span className="text-[11px] font-bold text-[#242832]/60 uppercase tracking-wider block">
                  Outstanding Balances
                </span>
                <span className="text-2xl font-black text-[#ED650B] mt-1 block">
                  ₹{stats.outstandingBalances.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#242832]/60 mt-0.5 block">
                  Pending client completion
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6E8ED] shadow-sm">
                <span className="text-[11px] font-bold text-[#242832]/60 uppercase tracking-wider block">
                  Pending UTRs
                </span>
                <span className="text-2xl font-black text-amber-600 mt-1 block">
                  {stats.pendingVerificationCount}
                </span>
                <span className="text-[10px] text-[#242832]/60 mt-0.5 block">
                  Awaiting owner verification
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E6E8ED] shadow-sm">
                <span className="text-[11px] font-bold text-[#242832]/60 uppercase tracking-wider block">
                  Official UPI ID
                </span>
                <span className="text-sm font-mono font-bold text-[#123578] mt-2 block truncate">
                  9817961412@ibl
                </span>
                <span className="text-[10px] text-[#242832]/60 mt-0.5 block">
                  Active UPI Channel
                </span>
              </div>
            </div>

            {/* Quick Launch Banner for Website CMS */}
            <div className="bg-gradient-to-r from-[#123578] to-[#0d285b] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#ED650B] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Owner Content Management System
                </div>
                <h3 className="text-xl sm:text-2xl font-black">Manage Portfolio Projects, Logo & Website Content</h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Add or edit portfolio case studies, upload project photos, update website headlines, replace the logo, manage Trusted By marquee brands, and edit client reviews.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('cms')}
                className="bg-[#ED650B] hover:bg-[#d65805] text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer shrink-0"
              >
                <span>Launch CMS Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E8ED] shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-[#123578]">Recent Activity Log</h2>
              <div className="divide-y divide-[#E6E8ED]">
                {stats.recentActivity.map((act, idx) => (
                  <div key={idx} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        act.type === 'payment' ? 'bg-[#25D366]' : 'bg-[#ED650B]'
                      }`} />
                      <span className="font-semibold text-[#242832]">{act.description}</span>
                    </div>
                    <div className="font-mono text-[#242832]/50 text-[11px]">
                      {new Date(act.timestamp).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB CMS: WEBSITE CONTENT MANAGEMENT SYSTEM */}
        {activeTab === 'cms' && token && (
          <div className="animate-in fade-in duration-200">
            <AdminCMS token={token} />
          </div>
        )}

        {/* TAB BANNERS: DEDICATED WEBSITE IMAGES & BANNERS MANAGER */}
        {activeTab === 'banners' && token && (
          <div className="animate-in fade-in duration-200">
            <WebsiteImagesManager token={token} onRefresh={fetchAllData} />
          </div>
        )}

        {/* TAB B: ENQUIRY MANAGEMENT */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-4 border border-[#E6E8ED] flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, company, email..."
                  value={enquirySearch}
                  onChange={e => setEnquirySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E6E8ED] text-xs focus:outline-none focus:ring-2 focus:ring-[#123578]/20"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold">Status:</span>
                <select
                  value={enquiryFilterStatus}
                  onChange={e => setEnquiryFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#E6E8ED] text-xs font-semibold text-[#123578] bg-[#F7F7F5]"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Converted">Converted</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-3xl border border-[#E6E8ED] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F5] border-b border-[#E6E8ED] text-[#123578] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Client / Brand</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Service</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E8ED]">
                    {filteredEnquiries.map(enq => (
                      <tr key={enq.id} className="hover:bg-[#EEF2F9]/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#123578]">{enq.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-[#242832]">{enq.name}</div>
                          <div className="text-[11px] text-[#242832]/60">{enq.company || '—'}</div>
                        </td>
                        <td className="p-4 font-mono text-[11px]">
                          <div>{enq.email}</div>
                          <div className="text-emerald-700 font-semibold">{enq.phone}</div>
                        </td>
                        <td className="p-4 font-semibold text-[#123578]">{enq.service}</td>
                        <td className="p-4">
                          <select
                            value={enq.status}
                            onChange={e => handleUpdateEnquiryStatus(enq.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                              enq.status === 'New'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : enq.status === 'Contacted'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : enq.status === 'Converted'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </td>
                        <td className="p-4 font-mono text-[#242832]/60 text-[11px]">
                          {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#EEF2F9] text-[#123578] font-bold hover:bg-[#123578] hover:text-white transition-colors"
                          >
                            View Brief
                          </button>
                          {enq.status !== 'Converted' && (
                            <button
                              onClick={() => {
                                setConvertingEnquiry(enq);
                                setConvertForm({
                                  projectName: `${enq.service} for ${enq.company || enq.name}`,
                                  agreedAmount: '125000',
                                  startDate: new Date().toISOString().split('T')[0],
                                  deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
                                });
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#ED650B] text-white font-bold hover:bg-[#d65805] transition-colors"
                            >
                              Convert to Project
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB C: CLIENT & PROJECT MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#123578]">Client & Project Ledger</h2>
                <p className="text-xs text-[#242832]/60">
                  Agreed amounts, milestones, deadlines, and private client payment portals.
                </p>
              </div>

              <button
                onClick={() => setShowNewProjectModal(true)}
                className="bg-[#ED650B] hover:bg-[#d65805] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(proj => {
                const projPayments = payments.filter(p => p.projectId === proj.id);
                const verified = projPayments.filter(p => p.status === 'Verified').reduce((sum, p) => sum + p.amount, 0);
                const balance = Math.max(0, proj.agreedAmount - verified);
                const paymentUrl = `${window.location.origin}/pay/${proj.clientPaymentToken}`;

                return (
                  <div key={proj.id} className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6E8ED] shadow-sm flex flex-col justify-between space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-[#ED650B]">{proj.id}</span>
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EEF2F9] text-[#123578]">
                          {proj.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#123578]">{proj.projectName}</h3>
                      <p className="text-xs text-[#242832]/70 mt-0.5">
                        Client: <strong>{proj.clientName}</strong> · Phone: {proj.contactPhone}
                      </p>

                      {/* Financial breakdown */}
                      <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-[#F7F7F5] rounded-xl text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">Agreed Amount</span>
                          <span className="font-bold text-[#123578]">₹{proj.agreedAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Verified Paid</span>
                          <span className="font-bold text-emerald-600">₹{verified.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Balance Due</span>
                          <span className="font-bold text-[#ED650B]">₹{balance.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-[#E6E8ED]">
                      {/* Private Payment Link */}
                      <div className="bg-[#EEF2F9]/60 p-2.5 rounded-xl border border-[#123578]/10 text-xs flex items-center justify-between">
                        <span className="text-[11px] font-medium text-[#123578] truncate max-w-[200px]">
                          /pay/{proj.clientPaymentToken}
                        </span>
                        <a
                          href={`/pay/${proj.clientPaymentToken}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#ED650B] hover:underline flex items-center gap-1"
                        >
                          <span>Open Client Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#242832]/60 font-mono">
                        <span>Start: {proj.startDate}</span>
                        <span>Deadline: {proj.deadline}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB D: PAYMENT MANAGEMENT & VERIFICATION */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 border border-[#E6E8ED] shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-[#123578]">UPI Payment Verification Desk</h2>
                <p className="text-xs text-[#242832]/70 mt-1">
                  Owner verification workflow: match client submitted UTR against agency bank statement before crediting balances.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F5] border-b border-[#E6E8ED] text-[#123578] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Payment ID</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Amount (INR)</th>
                      <th className="p-4">UTR Reference</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4 text-right">Owner Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E8ED]">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-[#EEF2F9]/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#123578]">{p.id}</td>
                        <td className="p-4 font-semibold text-[#242832]">{p.clientName}</td>
                        <td className="p-4 font-extrabold text-[#123578] text-sm">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 font-mono font-bold text-[#ED650B]">{p.utr}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            p.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.status === 'Rejected'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-[#242832]/60">
                          {new Date(p.paymentDate).toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {p.status === 'Pending Verification' && (
                            <>
                              <button
                                onClick={() => handleVerifyPayment(p.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer"
                              >
                                Verify in Bank
                              </button>
                              <button
                                onClick={() => setRejectingPaymentId(p.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {p.status === 'Verified' && (
                            <span className="text-xs text-emerald-700 font-semibold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verified by {p.verifiedBy || 'Owner'}</span>
                            </span>
                          )}
                          {p.status === 'Rejected' && (
                            <span className="text-xs text-red-600 font-semibold">
                              Rejected ({p.rejectionReason})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB E: INVOICES & RECEIPTS */}
        {activeTab === 'invoices' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Invoices */}
            <div className="bg-white rounded-3xl p-6 border border-[#E6E8ED] shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-[#123578]">Project Invoices</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F5] border-b border-[#E6E8ED] text-[#123578] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Invoice ID</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Project</th>
                      <th className="p-4">Agreed Total</th>
                      <th className="p-4">Due Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E8ED]">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-[#EEF2F9]/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#123578]">{inv.id}</td>
                        <td className="p-4 font-semibold text-[#242832]">{inv.clientName}</td>
                        <td className="p-4 text-[#242832]/80">{inv.projectName}</td>
                        <td className="p-4 font-bold text-[#123578]">₹{inv.amount.toLocaleString('en-IN')}</td>
                        <td className="p-4 font-mono text-[11px] text-[#242832]/60">{inv.dueDate}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EEF2F9] text-[#123578]">
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => downloadInvoicePDF(inv)}
                            className="px-3 py-1.5 rounded-lg bg-[#EEF2F9] text-[#123578] hover:bg-[#123578] hover:text-white font-bold flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[#ED650B]" />
                            <span>Download PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verified Receipts */}
            <div className="bg-white rounded-3xl p-6 border border-[#E6E8ED] shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-[#123578]">Official Verified Payment Receipts</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F7F5] border-b border-[#E6E8ED] text-[#123578] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Receipt ID</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Amount Verified</th>
                      <th className="p-4">Bank UTR</th>
                      <th className="p-4">Remaining Balance</th>
                      <th className="p-4">Verified Date</th>
                      <th className="p-4 text-right">PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E8ED]">
                    {receipts.map(rec => (
                      <tr key={rec.id} className="hover:bg-[#EEF2F9]/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#123578]">{rec.id}</td>
                        <td className="p-4 font-semibold text-[#242832]">{rec.clientName}</td>
                        <td className="p-4 font-extrabold text-emerald-700">₹{rec.amountReceived.toLocaleString('en-IN')}</td>
                        <td className="p-4 font-mono font-bold text-[#ED650B]">{rec.utr}</td>
                        <td className="p-4 font-bold text-[#123578]">₹{rec.remainingBalance.toLocaleString('en-IN')}</td>
                        <td className="p-4 font-mono text-[11px] text-[#242832]/60">
                          {new Date(rec.verifiedDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => downloadReceiptPDF(rec)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white font-bold flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[#ED650B]" />
                            <span>Download Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB F: SECURITY & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-3xl p-8 border border-[#E6E8ED] shadow-sm space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-[#123578]">Owner Credentials Management</h2>
              <p className="text-xs text-[#242832]/60 mt-1">
                Update your secure password or owner profile. Passwords are saved with salted key derivation.
              </p>
            </div>

            {passwordMsg && (
              <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                passwordMsg.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {passwordMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123578] mb-1.5">
                  Current Owner Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6E8ED] text-sm text-[#242832]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123578] mb-1.5">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6E8ED] text-sm text-[#242832]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#123578] hover:bg-[#0d285b] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Save New Credentials
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ENQUIRY BRIEF MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-[#E6E8ED] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6E8ED] pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#ED650B]">{selectedEnquiry.id}</span>
                <h3 className="text-lg font-bold text-[#123578]">{selectedEnquiry.name}</h3>
                <span className="text-xs text-[#242832]/60">{selectedEnquiry.company || 'Individual Client'}</span>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-[#F7F7F5] flex items-center justify-center text-slate-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F7F7F5] rounded-xl font-mono">
                <div>Email: <span className="font-bold text-[#123578]">{selectedEnquiry.email}</span></div>
                <div>Phone: <span className="font-bold text-emerald-700">{selectedEnquiry.phone}</span></div>
                <div>Service: <span className="font-bold">{selectedEnquiry.service}</span></div>
                <div>Budget: <span className="font-bold">{selectedEnquiry.budget || '—'}</span></div>
              </div>

              <div>
                <span className="font-bold text-[#123578] uppercase text-[10px] tracking-wider block mb-1">
                  Project Brief
                </span>
                <p className="p-3 bg-white border border-[#E6E8ED] rounded-xl text-[#242832]/85 leading-relaxed">
                  {selectedEnquiry.details}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#123578] uppercase text-[10px] tracking-wider block mb-1">
                  Internal Notes
                </span>
                <textarea
                  rows={2}
                  defaultValue={selectedEnquiry.internalNotes || ''}
                  onBlur={e => handleUpdateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, e.target.value)}
                  placeholder="Add internal notes on calls or milestones..."
                  className="w-full p-3 bg-[#F7F7F5] border border-[#E6E8ED] rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="bg-[#123578] text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONVERT ENQUIRY MODAL */}
      {convertingEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#E6E8ED] shadow-2xl">
            <h3 className="text-lg font-bold text-[#123578]">Convert Enquiry to Project</h3>
            <p className="text-xs text-[#242832]/70">
              Converting <strong>{convertingEnquiry.name}</strong> ({convertingEnquiry.company}) into an active project will generate an invoice and private payment link.
            </p>

            <form onSubmit={handleConvertEnquiry} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#123578] mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={convertForm.projectName}
                  onChange={e => setConvertForm({ ...convertForm, projectName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#123578] mb-1">Agreed Project Amount (INR)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={convertForm.agreedAmount}
                  onChange={e => setConvertForm({ ...convertForm, agreedAmount: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#123578] mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={convertForm.startDate}
                    onChange={e => setConvertForm({ ...convertForm, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#123578] mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={convertForm.deadline}
                    onChange={e => setConvertForm({ ...convertForm, deadline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConvertingEnquiry(null)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ED650B] hover:bg-[#d65805] text-white px-5 py-2 rounded-xl font-bold"
                >
                  Confirm & Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW PROJECT MODAL */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 border border-[#E6E8ED] shadow-2xl my-8">
            <h3 className="text-lg font-bold text-[#123578]">Create New Client Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#123578] mb-1">Client / Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kaveri Botanicals"
                  value={newProjectForm.clientName}
                  onChange={e => setNewProjectForm({ ...newProjectForm, clientName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#123578] mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="client@brand.com"
                    value={newProjectForm.contactEmail}
                    onChange={e => setNewProjectForm({ ...newProjectForm, contactEmail: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#123578] mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={newProjectForm.contactPhone}
                    onChange={e => setNewProjectForm({ ...newProjectForm, contactPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#123578] mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artisanal Skincare Packaging Suite"
                  value={newProjectForm.projectName}
                  onChange={e => setNewProjectForm({ ...newProjectForm, projectName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#123578] mb-1">Agreed Amount (INR)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newProjectForm.agreedAmount}
                  onChange={e => setNewProjectForm({ ...newProjectForm, agreedAmount: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#123578] mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newProjectForm.startDate}
                    onChange={e => setNewProjectForm({ ...newProjectForm, startDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#123578] mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={newProjectForm.deadline}
                    onChange={e => setNewProjectForm({ ...newProjectForm, deadline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E6E8ED]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#ED650B] hover:bg-[#d65805] text-white px-5 py-2.5 rounded-xl font-bold"
                >
                  Create Project & Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingPaymentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-red-200 shadow-2xl">
            <h3 className="text-base font-bold text-red-600">Reject Payment Transaction</h3>
            <p className="text-xs text-[#242832]/70">
              Provide an official reason for rejecting this UTR reference.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full p-3 text-xs border border-[#E6E8ED] rounded-xl"
            />
            <div className="flex justify-end gap-3 text-xs">
              <button
                onClick={() => setRejectingPaymentId(null)}
                className="px-3 py-1.5 text-slate-500"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPayment}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
