import React, { useState, useEffect } from 'react';
import {
  auth,
  subscribeToQuotations,
  updateQuotation,
  deleteQuotation,
  submitQuotationRequest,
  saveServiceItem,
  saveCompanyProfile,
} from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  QuotationRequest,
  QuotationStatus,
  ServiceItem,
  CompanyProfile,
  ServiceCategory,
} from '../types';
import {
  X,
  ShieldCheck,
  LogIn,
  LogOut,
  Mail,
  Lock,
  Search,
  Filter,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Building,
  Wrench,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  companyInfo: CompanyProfile;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  services,
  companyInfo,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'quotations' | 'services' | 'company' | 'stats'>('quotations');

  // Auth State
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Quotations List
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [quotationsLoading, setQuotationsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRequest | null>(null);
  const [noteEdit, setNoteEdit] = useState('');

  // Manual Add Quotation Modal
  const [isAddQuotationOpen, setIsAddQuotationOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustService, setNewCustService] = useState<ServiceCategory>('AIR_CONDITIONING');
  const [newCustLocation, setNewCustLocation] = useState('');
  const [newCustDetails, setNewCustDetails] = useState('');

  // Edit Company Profile
  const [companyForm, setCompanyForm] = useState<CompanyProfile>(companyInfo);
  const [companySaveStatus, setCompanySaveStatus] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setCompanyForm(companyInfo);
  }, [companyInfo]);

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setActionFeedback({ message, type });
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAuthError(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to quotations - ONLY when authenticated
  useEffect(() => {
    if (!isOpen) return;

    if (!user) {
      setQuotations([]);
      setQuotationsLoading(false);
      return;
    }

    setQuotationsLoading(true);
    const unsubscribe = subscribeToQuotations(
      (data) => {
        setQuotations(data);
        setQuotationsLoading(false);
      },
      (err) => {
        console.warn('Quotations subscription note:', err);
        setQuotationsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, user]);

  useEffect(() => {
    setCompanyForm(companyInfo);
  }, [companyInfo]);

  if (!isOpen) return null;

  // Authentication Handlers
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authMode === 'signin') {
        await signInWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      } else {
        await createUserWithEmailAndPassword(auth, emailInput.trim(), passwordInput);
      }
      setEmailInput('');
      setPasswordInput('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setAuthError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else if (err.code === 'auth/user-not-found') {
        setAuthError('ไม่พบบัญชีผู้ใช้นี้ กรุณาเลือก "สร้างบัญชีใหม่"');
      } else if (err.code === 'auth/email-already-in-use') {
        setAuthError('อีเมลนี้ถูกใช้งานแล้ว กรุณาเลือก "เข้าสู่ระบบ"');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      } else {
        setAuthError(err.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'ไม่สามารถเข้าสู่ระบบด้วย Google ได้');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  // Status Translation & Colors
  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'pending':
        return { label: 'รอดำเนินการ', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'contacted':
        return { label: 'ติดต่อแล้ว', bg: 'bg-sky-100 text-sky-800 border-sky-200' };
      case 'quoted':
        return { label: 'เสนอราคาแล้ว', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'scheduled':
        return { label: 'นัดดูหน้างาน', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      case 'completed':
        return { label: 'เสร็จสิ้น/ตกลงงาน', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'cancelled':
        return { label: 'ยกเลิก', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
      default:
        return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getServiceLabel = (type: ServiceCategory) => {
    switch (type) {
      case 'AIR_CONDITIONING':
        return 'AIR CONDITIONING (เครื่องปรับอากาศ)';
      case 'COLD_ROOM':
        return 'Cold Room (ห้องเย็น)';
      case 'DUCT_PIPE':
        return 'Duct Pipe (ท่อลม)';
      case 'CHILLER':
        return 'Chiller (เครื่องทำความเย็น)';
      case 'FREEZER_SHOWCASE':
        return 'ตู้แช่ทุกประเภท';
      default:
        return 'บริการทั่วไป';
    }
  };

  // Quotation Management Handlers
  const handleStatusChange = async (id: string, newStatus: QuotationStatus) => {
    try {
      await updateQuotation(id, { status: newStatus });
      if (selectedQuotation && selectedQuotation.id === id) {
        setSelectedQuotation({ ...selectedQuotation, status: newStatus });
      }
      showFeedback('อัปเดตสถานะคำขอเรียบร้อยแล้ว');
    } catch (err) {
      showFeedback('ไม่สามารถอัปเดตสถานะได้ ตรวจสอบสิทธิ์ผู้ดูแลระบบ', 'error');
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      await updateQuotation(id, { adminNotes: noteEdit });
      if (selectedQuotation && selectedQuotation.id === id) {
        setSelectedQuotation({ ...selectedQuotation, adminNotes: noteEdit });
      }
      showFeedback('บันทึกหมายเหตุเรียบร้อยแล้ว');
    } catch (err) {
      showFeedback('ไม่สามารถบันทึกหมายเหตุได้', 'error');
    }
  };

  const handleDeleteQuotation = async (id: string) => {
    try {
      await deleteQuotation(id);
      if (selectedQuotation?.id === id) setSelectedQuotation(null);
      setConfirmDeleteId(null);
      showFeedback('ลบคำขอออกจากระบบเรียบร้อยแล้ว');
    } catch (err) {
      showFeedback('ไม่สามารถลบรายการได้', 'error');
    }
  };

  // Create Manual Quotation
  const handleCreateManualQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    try {
      await submitQuotationRequest({
        customerName: newCustName,
        phone: newCustPhone,
        serviceType: newCustService,
        location: newCustLocation || undefined,
        details: newCustDetails || undefined,
        urgent: false,
      });
      setIsAddQuotationOpen(false);
      setNewCustName('');
      setNewCustPhone('');
      setNewCustLocation('');
      setNewCustDetails('');
      showFeedback('บันทึกคำขอใบเสนอราคาใหม่เรียบร้อยแล้ว');
    } catch (err) {
      showFeedback('เกิดข้อผิดพลาดในการบันทึกคำขอ', 'error');
    }
  };

  // Save Company Info
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanySaveStatus('กำลังบันทึก...');
    try {
      await saveCompanyProfile(companyForm);
      setCompanySaveStatus('บันทึกข้อมูลเรียบร้อยแล้ว!');
      setTimeout(() => setCompanySaveStatus(null), 3000);
    } catch (err) {
      setCompanySaveStatus('เกิดข้อผิดพลาดในการบันทึก');
    }
  };

  // Filtered Quotations
  const filteredQuotations = quotations.filter((q) => {
    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;
    const matchesSearch =
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.phone.includes(searchQuery) ||
      (q.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.details || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate Counters
  const countPending = quotations.filter((q) => q.status === 'pending').length;
  const countScheduled = quotations.filter((q) => q.status === 'scheduled').length;
  const countCompleted = quotations.filter((q) => q.status === 'completed').length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-6xl h-[95vh] sm:h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base">ระบบจัดการข้อมูล 3T INTERCOOL & SERVICE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Firebase Cloud Firestore
                </span>
              </div>
              <p className="text-xs text-sky-200 hidden sm:block">
                Project: 3T INTERCOOL SERVICE | บริษัท 3ต อินเตอร์คูล แอนด์ เซอร์วิส จำกัด
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-white/10 py-1 px-3 rounded-full text-xs">
                <UserIcon className="w-3.5 h-3.5 text-sky-300" />
                <span className="max-w-[140px] truncate text-sky-100 font-medium">
                  {user.email || 'Admin'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="ml-1 text-orange-300 hover:text-orange-200 underline text-[11px] cursor-pointer"
                  title="ออกจากระบบ"
                >
                  ออก
                </button>
              </div>
            ) : null}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (If logged in or guest preview) */}
        <div className="border-b border-slate-200 bg-slate-50 px-4 flex items-center justify-between overflow-x-auto shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'quotations', label: 'ใบขอเสนอราคาและงานซ่อม', count: quotations.length },
              { id: 'services', label: 'รายการระบบบริการ (5 ระบบ)', count: services.length },
              { id: 'company', label: 'ข้อมูลบริษัท & ติดต่อ' },
              { id: 'stats', label: 'สถิติภาพรวม' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'border-sky-600 text-sky-700 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === tab.id
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {!user && (
            <div className="text-xs text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 shrink-0 font-medium hidden sm:flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span>เข้าสู่ระบบเพื่อแก้ไขข้อมูล</span>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          
          {/* If user is not authenticated, show sign-in option banner at top or login card */}
          {!user && (
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-sky-200 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                    <Lock className="w-3 h-3" />
                    <span>ระบบเข้าสู่ระบบด้วยอีเมลตามคำสั่ง</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    เข้าสู่ระบบด้วยอีเมลสำหรับผู้ดูแลโครงการ 3T INTERCOOL SERVICE
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    คุณสามารถเข้าสู่ระบบด้วยอีเมลของคุณ เช่น <span className="font-semibold text-slate-800">methasitbaraphom63@gmail.com</span> หรืออีเมลบริษัท <span className="font-semibold text-slate-800">3t.intercool@gmail.com</span> เพื่อจัดการใบขอราคา แก้ไขข้อมูล และอัปเดตสถานะงาน
                  </p>
                </div>

                <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <form onSubmit={handleEmailAuth} className="space-y-2.5">
                    {authError && (
                      <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                        {authError}
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-xs mb-1">
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className={`px-2 py-1 rounded font-bold cursor-pointer ${
                          authMode === 'signin' ? 'bg-sky-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        เข้าสู่ระบบ
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className={`px-2 py-1 rounded font-bold cursor-pointer ${
                          authMode === 'signup' ? 'bg-sky-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        ลงทะเบียนใหม่
                      </button>
                    </div>

                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        placeholder="อีเมล (เช่น user@gmail.com)"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={authLoading}
                        className="flex-1 py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>{authMode === 'signin' ? 'เข้าสู่ระบบด้วยอีเมล' : 'สร้างบัญชีด้วยอีเมล'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={authLoading}
                        className="py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
                        title="Google Sign-In"
                      >
                        <span>Google</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Quotations Management */}
          {activeTab === 'quotations' && (
            <div className="space-y-5">
              
              {/* Feedback Alert */}
              {actionFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    actionFeedback.type === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{actionFeedback.message}</span>
                </div>
              )}

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-xs font-semibold text-slate-500">คำขอทั้งหมด</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{quotations.length}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 shadow-2xs">
                  <div className="text-xs font-semibold text-amber-800">รอดำเนินการ</div>
                  <div className="text-2xl font-black text-amber-900 mt-1">{countPending}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 shadow-2xs">
                  <div className="text-xs font-semibold text-indigo-800">นัดหมายดูหน้างาน</div>
                  <div className="text-2xl font-black text-indigo-900 mt-1">{countScheduled}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                  <div className="text-xs font-semibold text-emerald-800">ปิดงาน / เรียบร้อย</div>
                  <div className="text-2xl font-black text-emerald-900 mt-1">{countCompleted}</div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, สถานที่..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                {/* Filter and Add Button */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-xs">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white"
                    >
                      <option value="ALL">สถานะทั้งหมด</option>
                      <option value="pending">รอดำเนินการ</option>
                      <option value="contacted">ติดต่อแล้ว</option>
                      <option value="quoted">เสนอราคาแล้ว</option>
                      <option value="scheduled">นัดดูหน้างาน</option>
                      <option value="completed">เสร็จสิ้น</option>
                      <option value="cancelled">ยกเลิก</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsAddQuotationOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>บันทึกคำขอใหม่</span>
                  </button>
                </div>
              </div>

              {/* Quotations List & Detail Drawer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Quotation Table / Cards */}
                <div className="lg:col-span-7 space-y-3">
                  {quotationsLoading ? (
                    <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
                      กำลังโหลดข้อมูลจาก Firebase...
                    </div>
                  ) : filteredQuotations.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 space-y-2">
                      <div className="text-base font-bold text-slate-700">ไม่พบคำขอตามเงื่อนไขที่เลือก</div>
                      <p className="text-xs">ลูกค้าสามารถส่งคำขอผ่านแบบฟอร์มหน้าเว็บ หรือกดปุ่ม "บันทึกคำขอใหม่" ด้านบน</p>
                    </div>
                  ) : (
                    filteredQuotations.map((item) => {
                      const badge = getStatusBadge(item.status);
                      const isSelected = selectedQuotation?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedQuotation(item);
                            setNoteEdit(item.adminNotes || '');
                          }}
                          className={`p-4 rounded-xl border bg-white transition-all cursor-pointer ${
                            isSelected
                              ? 'border-sky-500 ring-2 ring-sky-200 shadow-md'
                              : 'border-slate-200 hover:border-sky-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900">
                                  {item.customerName}
                                </span>
                                {item.urgent && (
                                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                                    ด่วน
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-semibold text-sky-700">
                                {getServiceLabel(item.serviceType)}
                              </span>
                            </div>

                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}
                            >
                              {badge.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-mono font-medium">{item.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">
                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('th-TH') : '-'}
                              </span>
                            </div>
                          </div>

                          {item.location && (
                            <div className="text-[11px] text-slate-500 truncate mb-1">
                              สถานที่: {item.location}
                            </div>
                          )}

                          {item.adminNotes && (
                            <div className="text-[11px] bg-slate-50 p-1.5 rounded text-slate-600 border border-slate-100 mt-2 truncate">
                              โน้ตภายใน: {item.adminNotes}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Right: Selected Quotation Details & Management Actions */}
                <div className="lg:col-span-5 sticky top-4">
                  {selectedQuotation ? (
                    <div className="p-5 rounded-2xl bg-white border border-sky-200 shadow-md space-y-4">
                      
                      {/* Header */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                        <div>
                          <div className="text-xs text-slate-500 font-mono">
                            ID: {selectedQuotation.id}
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">
                            {selectedQuotation.customerName}
                          </h4>
                          <div className="text-xs text-sky-700 font-semibold">
                            {getServiceLabel(selectedQuotation.serviceType)}
                          </div>
                        </div>

                        {confirmDeleteId === selectedQuotation.id ? (
                          <div className="flex items-center gap-1.5 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                            <span className="text-[11px] font-bold text-rose-700">ยืนยันลบ?</span>
                            <button
                              onClick={() => handleDeleteQuotation(selectedQuotation.id!)}
                              className="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
                            >
                              ลบ
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-300 cursor-pointer"
                            >
                              ยกเลิก
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(selectedQuotation.id!)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                            title="ลบรายการนี้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Direct Communication Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`tel:${selectedQuotation.phone.replace(/[^0-9]/g, '')}`}
                          className="p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>โทร {selectedQuotation.phone}</span>
                        </a>

                        {selectedQuotation.lineId ? (
                          <a
                            href={`https://line.me/ti/p/~${selectedQuotation.lineId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>LINE: {selectedQuotation.lineId}</span>
                          </a>
                        ) : (
                          <div className="p-2 rounded-xl bg-slate-100 text-slate-500 font-medium text-xs flex items-center justify-center">
                            ไม่มี LINE ID
                          </div>
                        )}
                      </div>

                      {/* Status Selector */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 block">
                          เปลี่ยนสถานะการดำเนินงาน:
                        </label>
                        <select
                          value={selectedQuotation.status}
                          onChange={(e) =>
                            handleStatusChange(
                              selectedQuotation.id!,
                              e.target.value as QuotationStatus
                            )
                          }
                          className="w-full p-2 text-xs font-bold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                        >
                          <option value="pending">1. รอดำเนินการ (Pending)</option>
                          <option value="contacted">2. ติดต่อลูกค้าแล้ว (Contacted)</option>
                          <option value="quoted">3. เสนอราคาเรียบร้อย (Quoted)</option>
                          <option value="scheduled">4. นัดหมายดูหน้างาน (Scheduled)</option>
                          <option value="completed">5. ดำเนินงานสำเร็จ (Completed)</option>
                          <option value="cancelled">6. ยกเลิก (Cancelled)</option>
                        </select>
                      </div>

                      {/* Contact & Location Info */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                        {selectedQuotation.email && (
                          <div>
                            <span className="font-semibold text-slate-500">อีเมล: </span>
                            <span className="text-slate-800">{selectedQuotation.email}</span>
                          </div>
                        )}
                        {selectedQuotation.location && (
                          <div>
                            <span className="font-semibold text-slate-500">สถานที่: </span>
                            <span className="text-slate-800">{selectedQuotation.location}</span>
                          </div>
                        )}
                        {selectedQuotation.details && (
                          <div>
                            <span className="font-semibold text-slate-500">รายละเอียด: </span>
                            <div className="text-slate-800 mt-1 whitespace-pre-wrap bg-white p-2 rounded border border-slate-200">
                              {selectedQuotation.details}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Admin Notes Box */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">
                            บันทึกโน้ตภายใน (Admin Notes):
                          </label>
                          <button
                            onClick={() => handleSaveNotes(selectedQuotation.id!)}
                            className="text-xs text-sky-600 hover:text-sky-800 font-bold cursor-pointer"
                          >
                            บันทึก
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={noteEdit}
                          onChange={(e) => setNoteEdit(e.target.value)}
                          placeholder="เช่น เสนอราคาแอร์ 28,000 บาท หรือนัดดูหน้างานวันเสาร์ที่ 18..."
                          className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500 resize-none"
                        ></textarea>
                      </div>

                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-300 text-center text-slate-400 text-xs space-y-2">
                      <Edit3 className="w-8 h-8 mx-auto text-slate-300" />
                      <div>คลิกเลือกรายการคำขอทางด้านซ้ายเพื่อดูรายละเอียดและเปลี่ยนสถานะ</div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Services Catalog Management */}
          {activeTab === 'services' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    จัดการรายการบริการ (5 ระบบหลัก)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ข้อมูลบริการจะแสดงผลบนหน้าเว็บไซต์ทันที
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((srv) => (
                  <div
                    key={srv.id || srv.title}
                    className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                          {srv.category}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {srv.title}
                        </h4>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          srv.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {srv.isActive ? 'เปิดแสดง' : 'ปิดซ่อน'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {srv.summary}
                    </p>

                    {srv.features && (
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                        {srv.features}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Company Profile & Settings */}
          {activeTab === 'company' && (
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  แก้ไขข้อมูลบริษัท & ช่องทางการติดต่อ
                </h3>
                <p className="text-xs text-slate-500">
                  อ้างอิงข้อมูลจากนามบัตรบริษัท 3ต อินเตอร์คูล แอนด์ เซอร์วิส จำกัด
                </p>
              </div>

              {companySaveStatus && (
                <div className="p-3 rounded-xl bg-sky-50 text-sky-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>{companySaveStatus}</span>
                </div>
              )}

              <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">ชื่อบริษัท (ภาษาไทย)</label>
                    <input
                      type="text"
                      value={companyForm.companyNameTh}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, companyNameTh: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">ชื่อบริษัท (ภาษาอังกฤษ)</label>
                    <input
                      type="text"
                      value={companyForm.companyNameEn}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, companyNameEn: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">ชื่อผู้บริหาร (Managing Director TH)</label>
                    <input
                      type="text"
                      value={companyForm.managingDirectorTh}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, managingDirectorTh: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">ชื่อผู้บริหาร (Managing Director EN)</label>
                    <input
                      type="text"
                      value={companyForm.managingDirectorEn}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, managingDirectorEn: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">เบอร์โทรศัพท์ (MD)</label>
                    <input
                      type="text"
                      value={companyForm.phone}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, phone: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">LINE ID (MD)</label>
                    <input
                      type="text"
                      value={companyForm.lineId}
                      onChange={(e) =>
                        setCompanyForm({ ...companyForm, lineId: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* Manager Section */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="font-bold text-slate-800 text-xs">ข้อมูลผู้จัดการ (Manager)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">ชื่อผู้จัดการ (Manager TH)</label>
                      <input
                        type="text"
                        value={companyForm.managerTh || ''}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, managerTh: e.target.value })
                        }
                        placeholder="นาย ศักดิ์ดา นามวิชัย"
                        className="w-full p-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">ชื่อผู้จัดการ (Manager EN)</label>
                      <input
                        type="text"
                        value={companyForm.managerEn || ''}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, managerEn: e.target.value })
                        }
                        placeholder="MR. SUKDA NAMWICHAI"
                        className="w-full p-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">เบอร์โทรศัพท์ผู้จัดการ (Manager)</label>
                      <input
                        type="text"
                        value={companyForm.managerPhone || ''}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, managerPhone: e.target.value })
                        }
                        placeholder="098-9128541"
                        className="w-full p-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">LINE ID ผู้จัดการ (Manager)</label>
                      <input
                        type="text"
                        value={companyForm.managerLineId || ''}
                        onChange={(e) =>
                          setCompanyForm({ ...companyForm, managerLineId: e.target.value })
                        }
                        placeholder="0989128541"
                        className="w-full p-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <label className="font-bold text-slate-700">อีเมลทางการของบริษัท</label>
                  <input
                    type="email"
                    value={companyForm.email}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, email: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ที่อยู่สำนักงาน</label>
                  <textarea
                    rows={2}
                    value={companyForm.address}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, address: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 resize-none"
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ประกาศด่วน / ข่าวสารบริการ</label>
                  <input
                    type="text"
                    value={companyForm.announcement || ''}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, announcement: e.target.value })
                    }
                    placeholder="เช่น เปิดรับงานติดตั้งระบบห้องเย็นโซนบางพลี-ลาดกระบัง"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกข้อมูลบริษัท</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Overview Stats */}
          {activeTab === 'stats' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Distribution by service */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">
                    สถิติคำขอแยกตามงานระบบ
                  </h4>

                  <div className="space-y-3">
                    {[
                      { type: 'AIR_CONDITIONING', label: 'AIR CONDITIONING (เครื่องปรับอากาศ)' },
                      { type: 'COLD_ROOM', label: 'COLD ROOM (ห้องเย็น)' },
                      { type: 'DUCT_PIPE', label: 'DUCT PIPE (ท่อลม)' },
                      { type: 'CHILLER', label: 'CHILLER (เครื่องทำความเย็น)' },
                      { type: 'FREEZER_SHOWCASE', label: 'งานระบบของตู้แช่ทุกประเภท' },
                    ].map((item) => {
                      const count = quotations.filter((q) => q.serviceType === item.type).length;
                      const pct = quotations.length > 0 ? (count / quotations.length) * 100 : 0;

                      return (
                        <div key={item.type} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-slate-700">{item.label}</span>
                            <span className="font-bold text-slate-900">
                              {count} รายการ ({pct.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-sky-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* System info */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    ข้อมูลสถานะ Cloud Database
                  </h4>

                  <div className="text-xs text-slate-600 space-y-2">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Project Name:</span>
                      <span className="font-bold text-slate-800">3T INTERCOOL SERVICE</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Firebase Region:</span>
                      <span className="font-bold text-slate-800">Default (asia-southeast1)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Authentication:</span>
                      <span className="font-bold text-emerald-600">Email/Password & Google Active</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Security Rules:</span>
                      <span className="font-bold text-emerald-600">Hardened ABAC Deployed</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* Manual Add Quotation Modal */}
      {isAddQuotationOpen && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-base text-slate-900">บันทึกคำขอเสนอราคาใหม่</h4>
              <button
                onClick={() => setIsAddQuotationOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualQuotation} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">ชื่อลูกค้า / บริษัท *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คุณธวัชชัย"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">เบอร์โทรศัพท์ *</label>
                <input
                  type="tel"
                  required
                  placeholder="081-xxxxxxx"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">งานระบบ</label>
                <select
                  value={newCustService}
                  onChange={(e) => setNewCustService(e.target.value as ServiceCategory)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1 font-semibold"
                >
                  <option value="AIR_CONDITIONING">1. งานระบบ AIR CONDITIONING (เครื่องปรับอากาศ)</option>
                  <option value="COLD_ROOM">2. งานระบบ COLD ROOM (ห้องเย็น)</option>
                  <option value="DUCT_PIPE">3. งานระบบ DUCT PIPE (ท่อลม)</option>
                  <option value="CHILLER">4. งานระบบ CHILLER (เครื่องทำความเย็น)</option>
                  <option value="FREEZER_SHOWCASE">5. งานระบบของตู้แช่ทุกประเภท</option>
                  <option value="OTHER">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">สถานที่</label>
                <input
                  type="text"
                  placeholder="ลาดกระบัง, กทม."
                  value={newCustLocation}
                  onChange={(e) => setNewCustLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">รายละเอียดงาน</label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดอาการ หรือขอบเขตงาน..."
                  value={newCustDetails}
                  onChange={(e) => setNewCustDetails(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 mt-1 resize-none"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddQuotationOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold"
                >
                  บันทึกลง Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
