import React, { useState, useEffect, useRef } from "react";
import api from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";
import { 
  Send, 
  MessageSquare, 
  Search, 
  Clock, 
  CheckCheck, 
  User, 
  Sparkles, 
  RefreshCw,
  ArrowLeft,
  Star,
  GraduationCap,
  X,
  Users,
  CheckCircle2,
  Inbox
} from "lucide-react";

export default function ChatRoom({ pageTitle = "Ruang Diskusi & Konsultasi Langsung" }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'paired' | 'unread'
  const [showMobileChat, setShowMobileChat] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll ke pesan terbawah
  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // 1. Ambil daftar kontak
  const fetchContacts = async (silent = false) => {
    if (!silent) setLoadingContacts(true);
    try {
      const res = await api.get("/chat/contacts");
      const list = res.data?.data || [];
      setContacts(list);

      // Jika belum ada kontak aktif yang dipilih, pilih kontak pertama
      setActiveContact((prev) => {
        if (!prev && list.length > 0) {
          return list[0];
        }
        // Perbarui data kontak aktif yang sudah ada jika ada perubahan unread / pesan
        if (prev) {
          const updated = list.find((c) => c.id === prev.id);
          return updated || prev;
        }
        return prev;
      });
    } catch (err) {
      console.error("Gagal memuat kontak chat:", err);
    } finally {
      if (!silent) setLoadingContacts(false);
    }
  };

  // 2. Ambil riwayat percakapan dengan kontak aktif
  const fetchMessages = async (contactId, silent = false) => {
    if (!contactId) return;
    if (!silent) setLoadingMessages(true);
    try {
      const res = await api.get(`/chat/messages/${contactId}`);
      setMessages(res.data?.data || []);
      if (!silent) scrollToBottom("auto");
    } catch (err) {
      console.error("Gagal memuat pesan:", err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // Memilih kontak percakapan
  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    setShowMobileChat(true);

    // Tandai pesan telah dibaca jika ada unread
    if (contact.unread_count > 0) {
      api.patch(`/chat/messages/${contact.id}/read`).catch(() => {});
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, unread_count: 0 } : c))
      );
    }
  };

  useEffect(() => {
    fetchContacts();
    // Polling daftar kontak setiap 10 detik
    const contactInterval = setInterval(() => fetchContacts(true), 10000);
    return () => clearInterval(contactInterval);
  }, []);

  useEffect(() => {
    if (activeContact?.id) {
      fetchMessages(activeContact.id, false);
      // Polling pesan aktif setiap 3 detik
      const msgInterval = setInterval(() => {
        fetchMessages(activeContact.id, true);
      }, 3000);
      return () => clearInterval(msgInterval);
    }
  }, [activeContact?.id]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages]);

  // Kirim Pesan
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeContact?.id || sending) return;

    const messageText = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      const res = await api.post("/chat/messages", {
        receiver_id: activeContact.id,
        message: messageText,
      });

      if (res.data?.data) {
        setMessages((prev) => [...prev, res.data.data]);
        scrollToBottom("smooth");
      }

      // Perbarui preview percakapan di daftar kontak
      fetchContacts(true);
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      alert("Gagal mengirim pesan. Silakan coba lagi.");
      setInputText(messageText);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Halo! Saya ingin konsultasi tugas modul ini.",
    "Bisa tolong review kode implementasi saya?",
    "Apakah jadwal sesi mentoring kita sudah sesuai?",
    "Terima kasih banyak atas feedback-nya!",
  ];

  // Filtering kontak
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.role && c.role.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === "paired") {
      return c.is_paired;
    }
    if (filterTab === "unread") {
      return c.unread_count > 0;
    }
    return true;
  });

  const totalPairedCount = contacts.filter((c) => c.is_paired).length;
  const totalUnreadCount = contacts.filter((c) => c.unread_count > 0).length;

  return (
    <div className="space-y-4">
      {/* Top Banner Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#7B5E4A] text-xs font-bold border border-amber-200 mb-1">
            <Sparkles size={12} className="text-[#b38867]" />
            <span>Direct Messaging & Konsultasi Langsung</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Komunikasi harian yang responsif antara Mentor dan Mentee untuk percepatan pemahaman materi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time Chat Aktif</span>
          </span>
        </div>
      </div>

      {/* Main 2-Column Flex Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row h-[700px] max-h-[calc(100vh-13rem)]">
        
        {/* ============================================================== */}
        {/* SISI KIRI: DAFTAR KONTAK (Fixed Width, Flexbox Kokoh)          */}
        {/* ============================================================== */}
        <div 
          className={`w-full lg:w-84 xl:w-92 shrink-0 border-r border-slate-200 flex flex-col h-full bg-slate-50/70 ${
            showMobileChat ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Header Kontak: Pencarian & Status */}
          <div className="p-3.5 border-b border-slate-200 bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <Users size={14} className="text-[#b38867]" />
                <span>Daftar Kontak ({contacts.length})</span>
              </span>
              <button
                type="button"
                onClick={() => fetchContacts(false)}
                disabled={loadingContacts}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                title="Segarkan daftar kontak"
              >
                <RefreshCw size={13} className={loadingContacts ? "animate-spin text-[#b38867]" : ""} />
              </button>
            </div>

            {/* Kotak Pencarian */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau email..."
                className="w-full pl-8 pr-7 py-2 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#b38867] border border-transparent focus:border-[#b38867] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className={`flex-1 py-1 rounded-lg transition text-center ${
                  filterTab === "all"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Semua ({contacts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("paired")}
                className={`flex-1 py-1 rounded-lg transition text-center ${
                  filterTab === "paired"
                    ? "bg-white text-[#7B5E4A] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Kontak mentor/mentee bimbingan resmi"
              >
                Bimbingan ({totalPairedCount})
              </button>
              {totalUnreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterTab("unread")}
                  className={`flex-1 py-1 rounded-lg transition text-center flex items-center justify-center gap-1 ${
                    filterTab === "unread"
                      ? "bg-rose-50 text-rose-700 shadow-2xs"
                      : "text-rose-600 hover:text-rose-700"
                  }`}
                >
                  <span>Pesan</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                </button>
              )}
            </div>
          </div>

          {/* List Kontak Scrollable */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80">
            {loadingContacts ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-[#b38867]" />
                <span>Memuat kontak percakapan...</span>
              </div>
            ) : filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => {
                const isActive = activeContact?.id === contact.id;
                return (
                  <button
                    key={contact.id}
                    onClick={() => handleSelectContact(contact)}
                    className={`w-full p-3.5 text-left transition flex items-start gap-3 relative cursor-pointer ${
                      isActive
                        ? "bg-amber-50/90 border-r-3 border-[#b38867]"
                        : "hover:bg-slate-100/80 bg-white"
                    }`}
                  >
                    {/* Avatar Kontak */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xs ${
                          contact.is_paired
                            ? isActive
                              ? "bg-[#b38867] text-white"
                              : "bg-amber-100 text-[#7B5E4A] border border-amber-300/60"
                            : isActive
                            ? "bg-slate-800 text-white"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {contact.avatar}
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
                    </div>

                    {/* Metadata Kontak */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-slate-900 truncate">
                          {contact.name}
                        </span>
                        {contact.last_time && (
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">
                            {new Date(contact.last_time).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>

                      {/* Lencana Peran / Bimbingan */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {contact.is_paired ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-amber-100 text-[#7B5E4A] text-[9.5px] font-extrabold border border-amber-300/60">
                            <Star size={9} className="fill-[#b38867] text-[#b38867]" />
                            <span>{contact.paired_label || "Bimbingan Resmi"}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {contact.role}
                          </span>
                        )}
                      </div>

                      {/* Cuplikan Pesan Terakhir */}
                      <p className="text-[11px] text-slate-500 truncate mt-1 font-medium">
                        {contact.last_message}
                      </p>
                    </div>

                    {/* Lencana Pesan Belum Dibaca */}
                    {contact.unread_count > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-2xs shrink-0 animate-pulse">
                        {contact.unread_count}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                <MessageSquare size={26} className="mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-700">Kontak Tidak Ditemukan</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Coba cari dengan kata kunci lain atau ubah filter.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SISI KANAN: JENDELA PERCAKAPAN CHAT (Flex-1)                   */}
        {/* ============================================================== */}
        <div 
          className={`flex-1 flex flex-col h-full bg-white min-w-0 ${
            !showMobileChat ? "hidden lg:flex" : "flex"
          }`}
        >
          {activeContact ? (
            <>
              {/* Chat Window Header */}
              <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Tombol Kembali di Layar Kecil (Mobile) */}
                  <button
                    type="button"
                    onClick={() => setShowMobileChat(false)}
                    className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
                    title="Kembali ke daftar kontak"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xs ${
                        activeContact.is_paired
                          ? "bg-amber-100 text-[#7B5E4A] border border-amber-300/80"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {activeContact.avatar}
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
                  </div>

                  {/* Info Kontak Aktif */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm text-slate-900 leading-snug truncate">
                        {activeContact.name}
                      </h3>
                      {activeContact.is_paired && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-100 text-[#7B5E4A] text-[10px] font-bold border border-amber-300/60 shrink-0">
                          <Star size={9} className="fill-[#b38867] text-[#b38867]" />
                          <span>{activeContact.paired_label || "Bimbingan"}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium truncate">
                      <span className="text-emerald-600 font-bold">Aktif</span>
                      <span>•</span>
                      <span>{activeContact.role}</span>
                      <span>•</span>
                      <span className="truncate">{activeContact.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span>Terenkripsi</span>
                  </span>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-[#FAF8F5]/60">
                {loadingMessages ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#b38867]" />
                    <span>Memuat riwayat percakapan...</span>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id;
                    const timeStr = new Date(msg.created_at).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[72%] rounded-2xl px-4 py-2.5 shadow-2xs text-xs sm:text-sm leading-relaxed transition ${
                            isMe
                              ? "bg-gradient-to-r from-[#b38867] to-[#9d7353] text-white rounded-br-xs"
                              : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap font-medium">{msg.message}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              isMe ? "text-amber-100/90" : "text-slate-400"
                            }`}
                          >
                            <span>{timeStr}</span>
                            {isMe && (
                              <CheckCheck
                                size={12}
                                className={msg.is_read ? "text-amber-200 font-bold" : "text-white/60"}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#b38867] border border-amber-200 flex items-center justify-center mx-auto mb-2">
                      <MessageSquare size={24} />
                    </div>
                    <p className="font-extrabold text-slate-800 text-sm">Mulai Percakapan Baru</p>
                    <p className="text-slate-500 text-[11px] max-w-sm mx-auto leading-relaxed">
                      Kirim pertanyaan atau diskusi langsung kepada{" "}
                      <span className="font-bold text-slate-700">{activeContact.name}</span> seputar tugas, jadwal, atau materi pembelajaran.
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions Suggestions */}
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
                <span className="text-slate-400 font-bold shrink-0">Cepat:</span>
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(q)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-[#7B5E4A] hover:border-amber-200 border border-slate-200 text-slate-600 font-medium transition shrink-0 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Message Input Box Form */}
              <div className="p-3.5 border-t border-slate-200 bg-white shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <textarea
                    rows="1"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Ketik pesan untuk ${activeContact.name}... (Enter untuk kirim)`}
                    className="flex-1 py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#b38867] focus:ring-1 focus:ring-[#b38867] resize-none font-medium max-h-24 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="p-3 bg-[#b38867] hover:bg-[#a27355] text-white rounded-2xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center cursor-pointer"
                    title="Kirim pesan (Enter)"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare size={44} className="text-slate-300 mb-3" />
              <h3 className="font-extrabold text-slate-700 text-sm">Pilih Kontak Percakapan</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Silakan pilih salah satu mentor atau mentee pada daftar di sebelah kiri untuk memulai sesi diskusi.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
