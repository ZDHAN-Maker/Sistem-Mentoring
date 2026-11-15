import React, { useState, useEffect, useMemo } from "react";
import api from "../../../axiosInstance";
import { 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  RefreshCw, 
  Search, 
  Calendar,
  Clock,
  Phone,
  Mail,
  Copy,
  Check,
  X,
  UserCheck,
  Crown,
  Users,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Eye,
  Filter,
  Download,
  CalendarPlus,
  Award,
  TrendingUp,
  Activity,
  BellRing,
  StopCircle
} from "lucide-react";

// Max capacity of mentees per mentor
const MAX_MENTEES_PER_MENTOR = 5;

// Official WhatsApp Icon SVG
const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
  </svg>
);

const PairingAdmin = () => {
  const [pairings, setPairings] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittingEnd, setSubmittingEnd] = useState(false);
  const [submittingExtend, setSubmittingExtend] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [copiedPhone, setCopiedPhone] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pairingToEnd, setPairingToEnd] = useState(null); // For Custom Confirmation Modal with Evaluation
  const [pairingToExtend, setPairingToExtend] = useState(null); // For Extend Subscription Modal
  const [selectedPairingDetail, setSelectedPairingDetail] = useState(null); // For Detail Modal

  // Smart Matchmaking filter in Create Modal
  const [smartMatchOnly, setSmartMatchOnly] = useState(false);

  // Form State for Create Pairing
  const todayStr = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    mentor_id: "",
    mentee_id: "",
    subscription_plan_id: "",
    subscription_name: "",
    duration_months: 1,
    started_at: todayStr,
    ended_at: "",
    notes: ""
  });

  // Form State for Extend Pairing
  const [extendData, setExtendData] = useState({
    additional_months: 1,
    subscription_plan_id: "",
    subscription_name: "",
    notes: ""
  });

  // Form State for End Pairing with Evaluation & Certificate
  const [endData, setEndData] = useState({
    completion_status: "lulus_memuaskan",
    completion_notes: "",
    certificate_eligible: true
  });

  // Calculate default ended_at whenever duration_months or started_at changes
  useEffect(() => {
    if (formData.started_at && formData.duration_months) {
      const start = new Date(formData.started_at);
      const end = new Date(start);
      end.setMonth(end.getMonth() + parseInt(formData.duration_months || 1));
      setFormData(prev => ({ ...prev, ended_at: end.toISOString().split("T")[0] }));
    }
  }, [formData.started_at, formData.duration_months]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pairRes, mentorRes, menteeRes, planRes] = await Promise.all([
        api.get("/pairings"),
        api.get("/mentors"),
        api.get("/mentees"),
        api.get("/subscription-plans")
      ]);
      setPairings(pairRes.data.data || []);
      setMentors(mentorRes.data || []);
      setMentees(menteeRes.data || []);
      setSubscriptionPlans(planRes.data.data || []);
    } catch (err) {
      console.error("Gagal memuat data pairing:", err);
      setFeedback({ type: "error", message: "Gagal memuat data dari server." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format Helper for Phone & WhatsApp
  const formatPhoneForWA = (phone) => {
    if (!phone) return null;
    let cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.slice(1);
    }
    return cleaned;
  };

  const handleCopyPhone = (phone, label) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedPhone(`${label}: ${phone}`);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  // Helper date & countdown
  const getElapsedDays = (startDate) => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const getRemainingDays = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getProgressPercentage = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    if (now <= start) return 0;
    if (now >= end) return 100;
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  };

  const formatDateIndo = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const total = pairings.length;
    const active = pairings.filter(p => p.status === "active").length;
    const activeSub = pairings.filter(p => {
      if (p.status !== "active") return false;
      const rem = getRemainingDays(p.ended_at);
      return rem === null || rem >= 0;
    }).length;
    const completed = pairings.filter(p => p.status === "completed").length;
    return { total, active, activeSub, completed };
  }, [pairings]);

  // Selected Mentor & Mentee preview objects for modal
  const selectedMentor = mentors.find(m => String(m.id) === String(formData.mentor_id));
  const selectedMentee = mentees.find(m => String(m.id) === String(formData.mentee_id));

  // Smart Matchmaking logic
  // Checks which mentors have activities matching the selected mentee's bio or interests
  const rankedMentors = useMemo(() => {
    if (!selectedMentee) return mentors;

    const menteeKeywords = (selectedMentee.bio || selectedMentee.name || "").toLowerCase();

    return [...mentors].sort((a, b) => {
      const aMatches = (a.learning_activities || a.learningActivities || []).filter(act => 
        menteeKeywords.includes(act.title.toLowerCase()) || 
        (act.title.toLowerCase().includes("react") && menteeKeywords.includes("frontend")) ||
        (act.title.toLowerCase().includes("laravel") && menteeKeywords.includes("web"))
      ).length;

      const bMatches = (b.learning_activities || b.learningActivities || []).filter(act => 
        menteeKeywords.includes(act.title.toLowerCase()) || 
        (act.title.toLowerCase().includes("react") && menteeKeywords.includes("frontend")) ||
        (act.title.toLowerCase().includes("laravel") && menteeKeywords.includes("web"))
      ).length;

      return bMatches - aMatches;
    });
  }, [mentors, selectedMentee]);

  const displayedMentors = useMemo(() => {
    if (!smartMatchOnly || !selectedMentee) return rankedMentors;
    const menteeKeywords = (selectedMentee.bio || "").toLowerCase();
    return rankedMentors.filter(m => {
      const acts = m.learning_activities || m.learningActivities || [];
      return acts.some(act => 
        menteeKeywords.includes(act.title.toLowerCase()) ||
        act.title.toLowerCase().includes("web")
      );
    });
  }, [rankedMentors, smartMatchOnly, selectedMentee]);

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlanSelect = (e) => {
    const planId = e.target.value;
    if (!planId) {
      setFormData(prev => ({
        ...prev,
        subscription_plan_id: "",
        subscription_name: ""
      }));
      return;
    }
    const foundPlan = subscriptionPlans.find(p => String(p.id) === String(planId));
    setFormData(prev => ({
      ...prev,
      subscription_plan_id: planId,
      subscription_name: foundPlan ? foundPlan.title : ""
    }));
  };

  const handleCreatePairing = async (e) => {
    e.preventDefault();
    if (!formData.mentor_id || !formData.mentee_id) {
      setFeedback({ type: "error", message: "Silakan pilih Mentor dan Mentee terlebih dahulu." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await api.post("/pairings", formData);
      setFeedback({ 
        type: "success", 
        message: res.data.message || "Pasangan mentoring berhasil dibentuk!" 
      });
      setFormData({
        mentor_id: "",
        mentee_id: "",
        subscription_plan_id: "",
        subscription_name: "",
        duration_months: 1,
        started_at: todayStr,
        ended_at: "",
        notes: ""
      });
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal membuat pairing.";
      setFeedback({ type: "error", message: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  // Open Extend Modal
  const openExtendModal = (pairing) => {
    setPairingToExtend(pairing);
    setExtendData({
      additional_months: 1,
      subscription_plan_id: pairing.subscription_plan_id || "",
      subscription_name: pairing.subscription_name || "",
      notes: ""
    });
  };

  // Submit Extend Pairing
  const handleExtendPairingSubmit = async (e) => {
    e.preventDefault();
    if (!pairingToExtend) return;

    setSubmittingExtend(true);
    try {
      const res = await api.patch(`/pairings/${pairingToExtend.id}/extend`, extendData);
      setFeedback({
        type: "success",
        message: res.data.message || `Masa langganan untuk ${pairingToExtend.mentee?.name} berhasil diperpanjang!`
      });
      setPairingToExtend(null);
      fetchData();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.response?.data?.message || "Gagal memperpanjang masa langganan."
      });
    } finally {
      setSubmittingExtend(false);
    }
  };

  // Open End Modal with Evaluation
  const openEndModal = (pairing) => {
    setPairingToEnd(pairing);
    setEndData({
      completion_status: "lulus_memuaskan",
      completion_notes: "",
      certificate_eligible: true
    });
  };

  // Complete Pairing with Evaluation
  const handleCompletePairingConfirmed = async () => {
    if (!pairingToEnd) return;

    setSubmittingEnd(true);
    try {
      const res = await api.patch(`/pairings/${pairingToEnd.id}/complete`, endData);
      setFeedback({ 
        type: "success", 
        message: res.data.message || `Sesi mentoring untuk ${pairingToEnd.mentee?.name || "Mentee"} resmi diselesaikan.` 
      });
      setPairingToEnd(null);
      if (selectedPairingDetail?.id === pairingToEnd.id) {
        setSelectedPairingDetail(null);
      }
      fetchData();
    } catch (err) {
      setFeedback({ 
        type: "error", 
        message: err.response?.data?.message || "Gagal mengakhiri pairing." 
      });
    } finally {
      setSubmittingEnd(false);
    }
  };

  // Export Data to CSV
  const handleExportCSV = () => {
    if (pairings.length === 0) {
      setFeedback({ type: "error", message: "Tidak ada data pairing untuk diekspor." });
      return;
    }

    const headers = [
      "ID Pairing",
      "Mentor",
      "Email Mentor",
      "No HP Mentor",
      "Mentee",
      "Email Mentee",
      "No HP Mentee",
      "Paket Langganan",
      "Durasi (Bulan)",
      "Tanggal Mulai",
      "Tanggal Selesai",
      "Hari Berjalan",
      "Sisa Hari",
      "Status Pairing",
      "Status Kelulusan",
      "Sertifikat",
      "Total Sesi Tutoring",
      "Total Tugas",
      "Catatan"
    ];

    const rows = pairings.map(p => {
      const elapsed = getElapsedDays(p.started_at);
      const remaining = getRemainingDays(p.ended_at);
      return [
        `#${p.id}`,
        `"${p.mentor?.name || ""}"`,
        `"${p.mentor?.email || ""}"`,
        `"${p.mentor?.phone || ""}"`,
        `"${p.mentee?.name || ""}"`,
        `"${p.mentee?.email || ""}"`,
        `"${p.mentee?.phone || ""}"`,
        `"${p.subscription_name || p.subscription_plan?.title || "Standar"}"`,
        p.duration_months || 1,
        p.started_at ? new Date(p.started_at).toISOString().split("T")[0] : "-",
        p.ended_at ? new Date(p.ended_at).toISOString().split("T")[0] : "-",
        elapsed,
        remaining !== null ? remaining : "-",
        p.status === "active" ? "Aktif" : "Selesai",
        p.completion_status || "-",
        p.certificate_eligible ? "Ya (Layak)" : "Tidak",
        p.schedules_count || 0,
        p.tasks_count || 0,
        `"${(p.notes || "").replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Pairing_Mentoring_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFeedback({ type: "success", message: "Data pairing berhasil diekspor ke format CSV / Excel." });
  };

  // Filtered Pairings
  const filteredPairings = useMemo(() => {
    return pairings.filter((p) => {
      const term = searchTerm.toLowerCase();
      const mentorName = p.mentor?.name?.toLowerCase() || "";
      const mentorEmail = p.mentor?.email?.toLowerCase() || "";
      const mentorPhone = p.mentor?.phone || "";
      const menteeName = p.mentee?.name?.toLowerCase() || "";
      const menteeEmail = p.mentee?.email?.toLowerCase() || "";
      const menteePhone = p.mentee?.phone || "";
      const planName = (p.subscription_name || p.subscription_plan?.title || "").toLowerCase();

      const matchesSearch = 
        mentorName.includes(term) ||
        mentorEmail.includes(term) ||
        mentorPhone.includes(term) ||
        menteeName.includes(term) ||
        menteeEmail.includes(term) ||
        menteePhone.includes(term) ||
        planName.includes(term);

      const matchesStatus = 
        statusFilter === "all" ? true : p.status === statusFilter;

      const matchesPlan = 
        planFilter === "all" 
          ? true 
          : String(p.subscription_plan_id) === String(planFilter) || (p.subscription_name && p.subscription_name.toLowerCase().includes(planFilter.toLowerCase()));

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [pairings, searchTerm, statusFilter, planFilter]);

  return (
    <div className="space-y-6 w-full">
      {/* Toast Notifikasi Tersalin */}
      {copiedPhone && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check size={16} className="text-emerald-400" />
          <span>Nomor telepon berhasil disalin ke clipboard!</span>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pairing Mentor & Mentee</h1>
          <p className="text-gray-500 text-sm mt-1">
            Jodohkan mentee dengan mentor yang tepat, pantau masa langganan aktif, durasi bimbingan, keaktifan sesi, dan kelola nomor kontak.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Tombol Ekspor CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm text-xs font-semibold"
            title="Ekspor rekap data pairing ke CSV/Excel"
          >
            <Download size={16} className="text-gray-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? "animate-spin text-[#b38867]" : ""} />
          </button>

          <button
            onClick={() => {
              setFeedback(null);
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            <UserPlus size={18} />
            Buat Pairing Baru
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pairing</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Semua riwayat pasangan</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Pairing Aktif</p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-1">{stats.active}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Bimbingan sedang berjalan</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#b38867] uppercase tracking-wider">Langganan Berjalan</p>
            <h3 className="text-2xl font-bold text-[#b38867] mt-1">{stats.activeSub}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Masa aktif valid</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#b38867]/10 text-[#b38867] flex items-center justify-center">
            <Crown size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sesi Selesai</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-1">{stats.completed}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Telah menyelesaikan masa</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Alert Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-red-600" />}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full">
        {/* Input Cari */}
        <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#b38867] focus-within:bg-white transition">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Cari nama mentor, mentee, nomor HP, atau paket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-xs text-gray-400 hover:text-gray-600">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <Filter size={14} className="text-gray-400" />
            <span>Filter:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 outline-none focus:ring-1 focus:ring-[#b38867]"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="completed">Selesai</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 outline-none focus:ring-1 focus:ring-[#b38867] max-w-[160px] truncate"
          >
            <option value="all">Semua Paket</option>
            {subscriptionPlans.map((sp) => (
              <option key={sp.id} value={sp.id}>
                {sp.title}
              </option>
            ))}
          </select>

          {(searchTerm || statusFilter !== "all" || planFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPlanFilter("all");
              }}
              className="text-xs text-[#b38867] hover:underline px-2 py-1"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Tabel Pairing */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-500 gap-3">
            <RefreshCw className="animate-spin text-[#b38867]" size={28} />
            <span className="text-sm font-medium">Memuat data pasangan mentoring...</span>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-4 px-5">ID</th>
                  <th className="py-4 px-5">Mentor & Beban Kuota</th>
                  <th className="py-4 px-5">Mentee & Kontak</th>
                  <th className="py-4 px-5">Masa Langganan Aktif</th>
                  <th className="py-4 px-5">Durasi Pairing</th>
                  <th className="py-4 px-5">Keaktifan Sesi</th>
                  <th className="py-4 px-5 text-center">Status</th>
                  <th className="py-4 px-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPairings.length > 0 ? (
                  filteredPairings.map((p) => {
                    const elapsedDays = getElapsedDays(p.started_at);
                    const remainingDays = getRemainingDays(p.ended_at);
                    const progressPct = getProgressPercentage(p.started_at, p.ended_at);
                    const isSessionActive = p.status === "active";

                    const mentorWA = formatPhoneForWA(p.mentor?.phone);
                    const menteeWA = formatPhoneForWA(p.mentee?.phone);

                    // Health check: has schedules or tasks?
                    const totalActivities = (p.schedules_count || 0) + (p.tasks_count || 0);

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition">
                        {/* ID */}
                        <td className="py-4 px-5 font-mono text-xs font-semibold text-gray-500">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                            #{p.id}
                          </span>
                        </td>

                        {/* Mentor & Workload */}
                        <td className="py-4 px-5">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#b38867]/15 text-[#b38867] flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {p.mentor?.avatar ? (
                                <img src={p.mentor.avatar} alt="Mentor" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                (p.mentor?.name || "M").charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-800 leading-tight">
                                {p.mentor?.name || "Mentor #" + p.mentor_id}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail size={12} className="text-gray-400" />
                                <span>{p.mentor?.email || "-"}</span>
                              </div>
                              {/* Phone / WA */}
                              {p.mentor?.phone ? (
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                                    <Phone size={10} className="text-gray-500" />
                                    {p.mentor.phone}
                                  </span>
                                  <button
                                    onClick={() => handleCopyPhone(p.mentor.phone, "Mentor")}
                                    title="Salin nomor HP"
                                    className="p-1 text-gray-400 hover:text-gray-600 transition"
                                  >
                                    <Copy size={11} />
                                  </button>
                                  {mentorWA && (
                                    <a
                                      href={`https://wa.me/${mentorWA}?text=${encodeURIComponent(
                                        `Halo Mentor ${p.mentor?.name || ""}, ini dari Admin Aeterna Mentoring terkait sesi bimbingan bersama mentee ${p.mentee?.name || ""}.`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition border border-emerald-200"
                                      title="Chat via WhatsApp"
                                    >
                                      <WhatsAppIcon className="w-3 h-3 text-emerald-600" />
                                      <span>WA</span>
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <div className="text-[11px] text-gray-400 italic">No. HP belum diisi</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Mentee & Contact */}
                        <td className="py-4 px-5">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {p.mentee?.avatar ? (
                                <img src={p.mentee.avatar} alt="Mentee" className="w-full h-full rounded-full object-cover" />
                              ) : (
                                (p.mentee?.name || "M").charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-800 leading-tight">
                                {p.mentee?.name || "Mentee #" + p.mentee_id}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail size={12} className="text-gray-400" />
                                <span>{p.mentee?.email || "-"}</span>
                              </div>
                              {/* Phone / WA */}
                              {p.mentee?.phone ? (
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                                    <Phone size={10} className="text-gray-500" />
                                    {p.mentee.phone}
                                  </span>
                                  <button
                                    onClick={() => handleCopyPhone(p.mentee.phone, "Mentee")}
                                    title="Salin nomor HP"
                                    className="p-1 text-gray-400 hover:text-gray-600 transition"
                                  >
                                    <Copy size={11} />
                                  </button>
                                  {menteeWA && (
                                    <a
                                      href={`https://wa.me/${menteeWA}?text=${encodeURIComponent(
                                        `Halo ${p.mentee?.name || ""}, ini dari Admin Aeterna Mentoring terkait sesi bimbingan Anda bersama mentor ${p.mentor?.name || ""}.`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition border border-emerald-200"
                                      title="Chat via WhatsApp"
                                    >
                                      <WhatsAppIcon className="w-3 h-3 text-emerald-600" />
                                      <span>WA</span>
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <div className="text-[11px] text-gray-400 italic">No. HP belum diisi</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Masa Langganan Aktif */}
                        <td className="py-4 px-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Crown size={14} className="text-[#b38867]" />
                              <span className="font-semibold text-gray-800 text-xs">
                                {p.subscription_name || p.subscription_plan?.title || "Paket Mentoring Standar"}
                              </span>
                            </div>

                            {/* Badge Countdown Masa Aktif */}
                            {isSessionActive ? (
                              remainingDays !== null ? (
                                remainingDays > 30 ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Sisa {remainingDays} Hari Aktif
                                  </span>
                                ) : remainingDays > 0 ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                    <Clock size={11} className="text-amber-600" />
                                    Segera Berakhir ({remainingDays} hari)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                                    <AlertCircle size={11} className="text-red-500" />
                                    Masa Langganan Habis
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                                  Aktif
                                </span>
                              )
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                                  Langganan Selesai
                                </span>
                                {p.certificate_eligible && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                                    <Award size={11} /> e-Sertifikat Diterbitkan
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Calendar size={11} className="text-gray-400" />
                              <span>
                                {formatDateIndo(p.started_at)} s/d {formatDateIndo(p.ended_at)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Durasi Pairing & Progress */}
                        <td className="py-4 px-5">
                          <div className="space-y-1.5 min-w-[130px]">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-gray-700">
                                {p.duration_months ? `${p.duration_months} Bulan` : "1 Bulan"}
                              </span>
                              <span className="text-[11px] text-gray-500 font-medium">
                                Berjalan {elapsedDays} hari
                              </span>
                            </div>

                            {/* Mini Progress Bar */}
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  !isSessionActive
                                    ? "bg-gray-400"
                                    : progressPct >= 100
                                    ? "bg-red-500"
                                    : progressPct >= 80
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{ width: `${progressPct}%` }}
                              ></div>
                            </div>
                            <div className="text-[10px] text-gray-400 text-right">
                              {progressPct}% dari total durasi
                            </div>
                          </div>
                        </td>

                        {/* Keaktifan Sesi (Session Health Indicator) */}
                        <td className="py-4 px-5">
                          <div className="space-y-1 text-xs">
                            {isSessionActive ? (
                              totalActivities > 0 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <Activity size={12} className="text-emerald-500" />
                                  Aktif ({p.schedules_count || 0} Sesi, {p.tasks_count || 0} Tugas)
                                </span>
                              ) : (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                    <Clock size={11} className="text-amber-600" />
                                    Perlu Jadwal Sesi
                                  </span>
                                  {mentorWA && (
                                    <a
                                      href={`https://wa.me/${mentorWA}?text=${encodeURIComponent(
                                        `Halo Mentor ${p.mentor?.name || ""}, admin memantau belum ada agenda bimbingan aktif bersama mentee ${p.mentee?.name || ""}. Mohon jadwalkan sesi di portal ya.`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-[#b38867] hover:underline flex items-center gap-1"
                                      title="Kirim pengingat via WhatsApp"
                                    >
                                      <BellRing size={10} /> Ingatkan Mentor
                                    </a>
                                  )}
                                </div>
                              )
                            ) : (
                              <span className="text-[11px] text-gray-500">
                                {p.completion_status === "lulus_memuaskan"
                                  ? "🏆 Lulus Memuaskan"
                                  : p.completion_status === "lulus_baik"
                                  ? "⭐ Lulus Baik"
                                  : "Selesai Standar"}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5 text-center">
                          {isSessionActive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                              Aktif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              <CheckCircle2 size={12} className="text-gray-400" />
                              Selesai
                            </span>
                          )}
                        </td>

                        {/* Aksi (Icon-only dengan Tooltip) */}
                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Tombol Detail */}
                            <div className="relative group">
                              <button
                                onClick={() => setSelectedPairingDetail(p)}
                                title="Lihat Detail Lengkap Pairing"
                                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                                aria-label="Lihat Detail Lengkap Pairing"
                              >
                                <Eye size={15} />
                              </button>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-150">
                                <span className="bg-gray-900 text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap">
                                  Detail Lengkap
                                </span>
                                <span className="w-1.5 h-1.5 -mt-0.5 bg-gray-900 rotate-45"></span>
                              </div>
                            </div>

                            {/* Tombol Perpanjang Langganan */}
                            {isSessionActive && (
                              <div className="relative group">
                                <button
                                  onClick={() => openExtendModal(p)}
                                  title="Perpanjang Masa Langganan"
                                  className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center transition shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                                  aria-label="Perpanjang Masa Langganan"
                                >
                                  <CalendarPlus size={15} />
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-150">
                                  <span className="bg-gray-900 text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap">
                                    Perpanjang Langganan
                                  </span>
                                  <span className="w-1.5 h-1.5 -mt-0.5 bg-gray-900 rotate-45"></span>
                                </div>
                              </div>
                            )}

                            {/* Tombol Akhiri Sesi */}
                            {isSessionActive && (
                              <div className="relative group">
                                <button
                                  onClick={() => openEndModal(p)}
                                  title="Akhiri & Evaluasi Sesi Mentoring"
                                  className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center transition shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                                  aria-label="Akhiri & Evaluasi Sesi Mentoring"
                                >
                                  <StopCircle size={15} />
                                </button>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-150">
                                  <span className="bg-gray-900 text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap">
                                    Akhiri & Evaluasi
                                  </span>
                                  <span className="w-1.5 h-1.5 -mt-0.5 bg-gray-900 rotate-45"></span>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users size={32} className="text-gray-300" />
                        <p className="text-sm font-medium">
                          {searchTerm || statusFilter !== "all" || planFilter !== "all"
                            ? "Tidak ada pairing yang cocok dengan kriteria filter/pencarian."
                            : "Belum ada pasangan mentoring terdaftar."}
                        </p>
                        {!searchTerm && statusFilter === "all" && planFilter === "all" && (
                          <button
                            onClick={() => setShowCreateModal(true)}
                            className="mt-1 text-xs font-semibold text-[#b38867] hover:underline"
                          >
                            + Pasangkan Mentor & Mentee Sekarang
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: BUAT PASANGAN MENTORING (SMART MATCHMAKING)     */}
      {/* ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b38867]/15 text-[#b38867] flex items-center justify-center font-bold">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Buat Pasangan Mentoring</h2>
                  <p className="text-xs text-gray-500">
                    Jodohkan mentor & mentee dengan rekomendasi kecocokan keahlian dan kuota.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreatePairing} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* 1. Pilih Mentee Pertama (Untuk Smart Matching Mentor) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  1. Pilih Mentee Bimbingan <span className="text-red-500">*</span>
                </label>
                <select
                  name="mentee_id"
                  value={formData.mentee_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#b38867]/20 focus:border-[#b38867] outline-none transition"
                >
                  <option value="">-- Pilih Mentee Terdaftar --</option>
                  {mentees.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email}) {m.phone ? `• Telp: ${m.phone}` : ""}
                    </option>
                  ))}
                </select>

                {/* Mentee Preview Card */}
                {selectedMentee && (
                  <div className="mt-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {selectedMentee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{selectedMentee.name}</div>
                        <div className="text-gray-500">{selectedMentee.email}</div>
                        {selectedMentee.bio && (
                          <div className="text-[11px] text-blue-700 mt-0.5 line-clamp-1">
                            Minat/Fokus: {selectedMentee.bio}
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedMentee.phone ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-100/60 px-2 py-1 rounded-lg border border-blue-200">
                        <Phone size={11} /> {selectedMentee.phone}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">Belum ada no. HP</span>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Pilih Mentor (dengan Kuota & Smart Matchmaking) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    2. Pilih Mentor Pembimbing <span className="text-red-500">*</span>
                  </label>
                  {selectedMentee && (
                    <button
                      type="button"
                      onClick={() => setSmartMatchOnly(!smartMatchOnly)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 transition ${
                        smartMatchOnly
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Sparkles size={11} className="text-amber-500" />
                      <span>{smartMatchOnly ? "Semua Mentor" : "Filter Mentor Cocok"}</span>
                    </button>
                  )}
                </div>

                <select
                  name="mentor_id"
                  value={formData.mentor_id}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#b38867]/20 focus:border-[#b38867] outline-none transition"
                >
                  <option value="">-- Pilih Mentor Pembimbing --</option>
                  {displayedMentors.map((m) => {
                    const activeCount = m.active_pairings_count || 0;
                    const isFull = activeCount >= MAX_MENTEES_PER_MENTOR;
                    const activities = (m.learning_activities || m.learningActivities || []).map(a => a.title).join(", ");
                    return (
                      <option key={m.id} value={m.id}>
                        {m.name} — Kuota: {activeCount}/{MAX_MENTEES_PER_MENTOR} {isFull ? "(Penuh)" : "(Tersedia)"} {activities ? `[${activities}]` : ""}
                      </option>
                    );
                  })}
                </select>

                {/* Mentor Preview & Capacity Card */}
                {selectedMentor && (
                  <div className="mt-2.5 p-3.5 rounded-xl bg-[#b38867]/5 border border-[#b38867]/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#b38867] text-white flex items-center justify-center font-bold text-xs">
                          {selectedMentor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{selectedMentor.name}</div>
                          <div className="text-gray-500">{selectedMentor.email}</div>
                        </div>
                      </div>
                      {selectedMentor.phone && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <Phone size={11} /> {selectedMentor.phone}
                        </span>
                      )}
                    </div>

                    {/* Kuota & Kapasitas Indicator */}
                    <div className="pt-2 border-t border-[#b38867]/15 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-medium">Beban Bimbingan:</span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                          (selectedMentor.active_pairings_count || 0) >= MAX_MENTEES_PER_MENTOR
                            ? "bg-red-100 text-red-700"
                            : (selectedMentor.active_pairings_count || 0) >= 3
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {selectedMentor.active_pairings_count || 0} / {MAX_MENTEES_PER_MENTOR} Mentee Aktif
                        </span>
                      </div>
                      {(selectedMentor.active_pairings_count || 0) >= MAX_MENTEES_PER_MENTOR && (
                        <span className="text-red-500 font-bold text-[11px] flex items-center gap-1">
                          <AlertTriangle size={12} /> Kuota Penuh
                        </span>
                      )}
                    </div>

                    {/* Bidang Keahlian */}
                    {(selectedMentor.learning_activities || selectedMentor.learningActivities || []).length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-gray-400 font-semibold">Keahlian:</span>
                        {(selectedMentor.learning_activities || selectedMentor.learningActivities).map(a => (
                          <span key={a.id} className="text-[10px] bg-white text-gray-700 px-2 py-0.5 rounded-md border border-gray-200">
                            {a.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Paket Langganan Mentoring */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  3. Paket Langganan Aktif
                </label>
                <select
                  name="subscription_plan_id"
                  value={formData.subscription_plan_id}
                  onChange={handlePlanSelect}
                  className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#b38867]/20 focus:border-[#b38867] outline-none transition"
                >
                  <option value="">-- Pilih Paket Langganan (Opsional) --</option>
                  {subscriptionPlans.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.title} — {sp.price}
                    </option>
                  ))}
                </select>
                {!formData.subscription_plan_id && (
                  <input
                    type="text"
                    name="subscription_name"
                    value={formData.subscription_name}
                    onChange={handleInputChange}
                    placeholder="Atau tulis nama paket khusus (misal: Paket Intensif Fast-Track)..."
                    className="mt-2 w-full p-2.5 text-xs border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                )}
              </div>

              {/* 4. Durasi & Periode */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    4. Durasi & Masa Aktif
                  </span>
                  <span className="text-xs text-[#b38867] font-semibold">
                    {formData.duration_months} Bulan Bimbingan
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, duration_months: m }))}
                      className={`py-2 text-xs font-semibold rounded-lg border transition ${
                        Number(formData.duration_months) === m
                          ? "bg-[#b38867] text-white border-[#b38867] shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {m} Bulan
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Tanggal Mulai Bimbingan
                    </label>
                    <input
                      type="date"
                      name="started_at"
                      value={formData.started_at}
                      onChange={handleInputChange}
                      className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-[#b38867]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Perkiraan Berakhir
                    </label>
                    <input
                      type="date"
                      name="ended_at"
                      value={formData.ended_at}
                      onChange={handleInputChange}
                      className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-[#b38867]"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 bg-white p-2.5 rounded-lg border border-gray-100 flex items-center gap-2">
                  <Calendar size={13} className="text-[#b38867]" />
                  <span>
                    Masa aktif bimbingan: <strong>{formatDateIndo(formData.started_at)}</strong> sampai <strong>{formatDateIndo(formData.ended_at)}</strong>
                  </span>
                </div>
              </div>

              {/* 5. Catatan Tambahan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  5. Catatan Tambahan (Opsional)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Misal: Batch 1 - Fokus Pengembangan Frontend Web & React..."
                  className="w-full p-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#b38867]/20 focus:border-[#b38867] outline-none transition resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      <span>Pasangkan Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: PERPANJANG MASA LANGGANAN (EXTEND PAIRING)      */}
      {/* ======================================================== */}
      {pairingToExtend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CalendarPlus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Perpanjang Masa Langganan
                  </h3>
                  <p className="text-xs text-gray-500">
                    Tambah durasi bimbingan aktif untuk #{pairingToExtend.id} ({pairingToExtend.mentee?.name})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPairingToExtend(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleExtendPairingSubmit} className="p-6 space-y-4">
              {/* Ringkasan Pasangan */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mentee:</span>
                  <span className="font-semibold text-gray-800">{pairingToExtend.mentee?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mentor:</span>
                  <span className="font-semibold text-gray-800">{pairingToExtend.mentor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Berakhir Saat Ini:</span>
                  <span className="font-semibold text-amber-700">{formatDateIndo(pairingToExtend.ended_at)}</span>
                </div>
              </div>

              {/* Pilihan Penambahan Durasi */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Tambah Durasi Bimbingan
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setExtendData(prev => ({ ...prev, additional_months: num }))}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        Number(extendData.additional_months) === num
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      +{num} Bulan
                    </button>
                  ))}
                </div>
              </div>

              {/* Ganti / Upgrade Paket (Opsional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Paket Langganan (Opsional)
                </label>
                <select
                  value={extendData.subscription_plan_id}
                  onChange={(e) => {
                    const pid = e.target.value;
                    const plan = subscriptionPlans.find(p => String(p.id) === String(pid));
                    setExtendData(prev => ({
                      ...prev,
                      subscription_plan_id: pid,
                      subscription_name: plan ? plan.title : ""
                    }));
                  }}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-600"
                >
                  <option value="">-- Pertahankan Paket Saat Ini --</option>
                  {subscriptionPlans.map(sp => (
                    <option key={sp.id} value={sp.id}>
                      {sp.title} ({sp.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Catatan Perpanjangan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Catatan Pembayaran / Referensi Perpanjangan
                </label>
                <input
                  type="text"
                  value={extendData.notes}
                  onChange={(e) => setExtendData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Misal: Perpanjangan paket via transfer manual..."
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-600"
                />
              </div>

              {/* Footer */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPairingToExtend(null)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingExtend}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {submittingExtend ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Konfirmasi Perpanjangan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: KONFIRMASI AKHIRI SESI DENGAN EVALUASI & SERTIF */}
      {/* ======================================================== */}
      {pairingToEnd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Alert */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Award size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Akhiri & Evaluasi Sesi Mentoring
                  </h3>
                  <p className="text-xs text-gray-500">
                    Tandai sesi bimbingan selesai dan tetapkan evaluasi kelulusan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPairingToEnd(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-4">
              {/* Info Pasangan Ringkas */}
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Pairing ID:</span>
                  <span className="font-mono font-semibold text-gray-700">#{pairingToEnd.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Mentee:</span>
                  <span className="font-semibold text-gray-800">{pairingToEnd.mentee?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Mentor:</span>
                  <span className="font-semibold text-gray-800">{pairingToEnd.mentor?.name}</span>
                </div>
              </div>

              {/* Status Kelulusan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Predikat Hasil Bimbingan
                </label>
                <select
                  value={endData.completion_status}
                  onChange={(e) => setEndData(prev => ({ ...prev, completion_status: e.target.value }))}
                  className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-amber-600"
                >
                  <option value="lulus_memuaskan">🏆 Lulus Sangat Memuaskan (Target Tercapai)</option>
                  <option value="lulus_baik">⭐ Lulus Baik (Kompeten)</option>
                  <option value="selesai_standar">✅ Selesai Masa Bimbingan Standar</option>
                  <option value="berhenti_awal">⚠️ Selesai Lebih Awal / Batal</option>
                </select>
              </div>

              {/* Checkbox Sertifikat */}
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl border border-purple-200">
                <input
                  type="checkbox"
                  id="certCheck"
                  checked={endData.certificate_eligible}
                  onChange={(e) => setEndData(prev => ({ ...prev, certificate_eligible: e.target.checked }))}
                  className="w-4 h-4 text-[#b38867] rounded focus:ring-[#b38867]"
                />
                <label htmlFor="certCheck" className="text-xs text-purple-900 font-semibold cursor-pointer">
                  Terbitkan e-Sertifikat Kelulusan Resmi untuk Mentee
                </label>
              </div>

              {/* Catatan Evaluasi */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Catatan Evaluasi / Rekomendasi Karir
                </label>
                <textarea
                  rows={2}
                  value={endData.completion_notes}
                  onChange={(e) => setEndData(prev => ({ ...prev, completion_notes: e.target.value }))}
                  placeholder="Misal: Mentee telah menyelesaikan seluruh tugas roadmap dengan portofolio siap kerja..."
                  className="w-full p-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-amber-600 resize-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPairingToEnd(null)}
                disabled={submittingEnd}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200/60 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCompletePairingConfirmed}
                disabled={submittingEnd}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition disabled:opacity-50"
              >
                {submittingEnd ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Selesaikan & Simpan Evaluasi</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: DETAIL LENGKAP PAIRING & KONTAK                 */}
      {/* ======================================================== */}
      {selectedPairingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#b38867]/15 text-[#b38867] flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-800">
                      Detail Pasangan Mentoring #{selectedPairingDetail.id}
                    </h2>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        selectedPairingDetail.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {selectedPairingDetail.status === "active" ? "Aktif" : "Selesai"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Informasi lengkap peserta, kontak komunikasi, dan status langganan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPairingDetail(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Mentor & Mentee Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mentor Card */}
                <div className="p-4 rounded-2xl bg-[#b38867]/5 border border-[#b38867]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#b38867] uppercase tracking-wider">
                      Profil Mentor
                    </span>
                    <span className="text-[10px] bg-[#b38867] text-white px-2 py-0.5 rounded-full font-medium">
                      Pembimbing
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#b38867] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                      {selectedPairingDetail.mentor?.avatar ? (
                        <img src={selectedPairingDetail.mentor.avatar} alt="Mentor" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        (selectedPairingDetail.mentor?.name || "M").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {selectedPairingDetail.mentor?.name}
                      </h4>
                      <p className="text-xs text-gray-500">{selectedPairingDetail.mentor?.email}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#b38867]/15 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Nomor WhatsApp/HP:</span>
                      <span className="font-semibold text-gray-800">
                        {selectedPairingDetail.mentor?.phone || "Belum diisi"}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {selectedPairingDetail.mentor?.phone && (
                        <>
                          <button
                            onClick={() => handleCopyPhone(selectedPairingDetail.mentor.phone, "Mentor")}
                            className="flex-1 py-1.5 px-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
                          >
                            <Copy size={12} />
                            <span>Salin No. HP</span>
                          </button>
                          {formatPhoneForWA(selectedPairingDetail.mentor.phone) && (
                            <a
                              href={`https://wa.me/${formatPhoneForWA(selectedPairingDetail.mentor.phone)}?text=${encodeURIComponent(
                                `Halo Mentor ${selectedPairingDetail.mentor?.name}, admin ingin berkoordinasi mengenai sesi mentoring.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                              <span>Hubungi WA</span>
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mentee Card */}
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                      Profil Mentee
                    </span>
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                      Peserta
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                      {selectedPairingDetail.mentee?.avatar ? (
                        <img src={selectedPairingDetail.mentee.avatar} alt="Mentee" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        (selectedPairingDetail.mentee?.name || "M").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {selectedPairingDetail.mentee?.name}
                      </h4>
                      <p className="text-xs text-gray-500">{selectedPairingDetail.mentee?.email}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-blue-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Nomor WhatsApp/HP:</span>
                      <span className="font-semibold text-gray-800">
                        {selectedPairingDetail.mentee?.phone || "Belum diisi"}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {selectedPairingDetail.mentee?.phone && (
                        <>
                          <button
                            onClick={() => handleCopyPhone(selectedPairingDetail.mentee.phone, "Mentee")}
                            className="flex-1 py-1.5 px-2 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
                          >
                            <Copy size={12} />
                            <span>Salin No. HP</span>
                          </button>
                          {formatPhoneForWA(selectedPairingDetail.mentee.phone) && (
                            <a
                              href={`https://wa.me/${formatPhoneForWA(selectedPairingDetail.mentee.phone)}?text=${encodeURIComponent(
                                `Halo Mentee ${selectedPairingDetail.mentee?.name}, admin ingin mengecek progres sesi mentoring Anda.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                              <span>Hubungi WA</span>
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Langganan & Durasi Bimbingan Card */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Crown size={18} className="text-[#b38867]" />
                    <span className="font-bold text-gray-800 text-sm">
                      Masa Langganan & Durasi Bimbingan
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-[#b38867]">
                    {selectedPairingDetail.subscription_name || selectedPairingDetail.subscription_plan?.title || "Paket Mentoring Standar"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[11px]">Durasi Total</span>
                    <span className="font-bold text-gray-800 text-sm mt-0.5 block">
                      {selectedPairingDetail.duration_months || 1} Bulan
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[11px]">Telah Berjalan</span>
                    <span className="font-bold text-blue-700 text-sm mt-0.5 block">
                      {getElapsedDays(selectedPairingDetail.started_at)} Hari
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[11px]">Sisa Masa Aktif</span>
                    <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
                      {getRemainingDays(selectedPairingDetail.ended_at) !== null
                        ? `${getRemainingDays(selectedPairingDetail.ended_at)} Hari`
                        : "Fleksibel"}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[11px]">Persentase</span>
                    <span className="font-bold text-[#b38867] text-sm mt-0.5 block">
                      {getProgressPercentage(selectedPairingDetail.started_at, selectedPairingDetail.ended_at)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Mulai: {formatDateIndo(selectedPairingDetail.started_at)}</span>
                    <span>Berakhir: {formatDateIndo(selectedPairingDetail.ended_at)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#b38867] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${getProgressPercentage(
                          selectedPairingDetail.started_at,
                          selectedPairingDetail.ended_at
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Catatan Sesi */}
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-1">
                  Catatan Tambahan
                </span>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedPairingDetail.notes || "Tidak ada catatan khusus untuk pasangan ini."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedPairingDetail.status === "active" && (
                  <>
                    <button
                      onClick={() => {
                        openExtendModal(selectedPairingDetail);
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
                    >
                      Perpanjang Langganan
                    </button>
                    <button
                      onClick={() => {
                        openEndModal(selectedPairingDetail);
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition"
                    >
                      Akhiri Sesi
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedPairingDetail(null)}
                className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PairingAdmin;
