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
  Phone,
  Video,
  Info
} from "lucide-react";

export default function ChatRoom({ pageTitle = "Ruang Diskusi & Pesan Langsung" }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef(null);

  // Auto-scroll ke pesan terbawah
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Ambil daftar kontak
  const fetchContacts = async (silent = false) => {
    if (!silent) setLoadingContacts(true);
    try {
      const res = await api.get("/chat/contacts");
      const list = res.data?.data || [];
      setContacts(list);

      // Jika belum ada kontak aktif yang dipilih, pilih kontak pertama
      if (!activeContact && list.length > 0) {
        setActiveContact(list[0]);
      }
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
      if (!silent) scrollToBottom();
    } catch (err) {
      console.error("Gagal memuat pesan:", err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // Polling kontak setiap 10 detik
    const contactInterval = setInterval(() => fetchContacts(true), 10000);
    return () => clearInterval(contactInterval);
  }, []);

  useEffect(() => {
    if (activeContact?.id) {
      fetchMessages(activeContact.id, false);
      // Polling pesan aktif setiap 3 detik untuk simulasi realtime
      const msgInterval = setInterval(() => {
        fetchMessages(activeContact.id, true);
      }, 3000);
      return () => clearInterval(msgInterval);
    }
  }, [activeContact?.id]);

  useEffect(() => {
    scrollToBottom();
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
        scrollToBottom();
      }

      // Perbarui juga preview di kontak
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

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#7B5E4A] text-xs font-bold border border-amber-200 mb-1">
            <Sparkles size={12} className="text-[#b38867]" />
            <span>Direct Messaging & Konsultasi Langsung</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
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

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] h-[calc(100vh-18rem)]">
        
        {/* ============================================================== */}
        {/* SISI KIRI: DAFTAR KONTAK (4 COLS)                              */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
          
          {/* Contact Search Bar */}
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kontak nama..."
                className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#b38867] border border-transparent focus:border-[#b38867]"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
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
                    onClick={() => setActiveContact(contact)}
                    className={`w-full p-3.5 text-left transition flex items-start gap-3 relative cursor-pointer ${
                      isActive
                        ? "bg-amber-50/70 border-r-3 border-[#b38867]"
                        : "hover:bg-slate-100/70 bg-white"
                    }`}
                  >
                    {/* Contact Avatar */}
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-2xs ${
                        isActive 
                          ? "bg-[#b38867] text-white" 
                          : "bg-slate-200 text-slate-700"
                      }`}>
                        {contact.avatar}
                      </div>
                      <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
                    </div>

                    {/* Contact Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-slate-900 truncate">
                          {contact.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {contact.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        {contact.last_message}
                      </p>
                    </div>

                    {/* Unread Pill */}
                    {contact.unread_count > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-2xs">
                        {contact.unread_count}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                <MessageSquare size={24} className="mx-auto mb-2 text-slate-300" />
                <span>Belum ada kontak aktif ditemukan.</span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SISI KANAN: JENDELA PERCAKAPAN CHAT (8 COLS)                    */}
        {/* ============================================================== */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white">
          {activeContact ? (
            <>
              {/* Chat Window Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#b38867] border border-amber-200 flex items-center justify-center font-bold text-sm shadow-2xs">
                    {activeContact.avatar}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 leading-snug">
                      {activeContact.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <span className="text-emerald-600 font-bold">Online</span>
                      <span>•</span>
                      <span>{activeContact.role}</span>
                      <span>•</span>
                      <span>{activeContact.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <span className="hidden sm:inline text-[11px] text-slate-400">
                    Sesi Chat Terenkripsi
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#FAF8F5]/60">
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
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-2xs text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? "bg-gradient-to-r from-[#b38867] to-[#9d7353] text-white rounded-br-xs"
                              : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap font-medium">{msg.message}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              isMe ? "text-amber-100" : "text-slate-400"
                            }`}
                          >
                            <span>{timeStr}</span>
                            {isMe && (
                              <CheckCheck size={12} className={msg.is_read ? "text-amber-200" : "text-white/60"} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                    <MessageSquare size={32} className="mx-auto text-slate-300" />
                    <p className="font-bold text-slate-700">Mulai Percakapan Baru</p>
                    <p className="text-slate-400 text-[11px] max-w-sm mx-auto">
                      Kirim pesan langsung kepada {activeContact.name} untuk mengajukan pertanyaan seputar materi atau bimbingan.
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Pills */}
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <span className="text-slate-400 font-medium shrink-0">Cepat:</span>
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

              {/* Message Input Box */}
              <div className="p-3.5 border-t border-slate-200 bg-white">
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
              <MessageSquare size={48} className="text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">Pilih Kontak Percakapan</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Silakan pilih salah satu mentor atau mentee pada daftar sebelah kiri untuk memulai diskusi.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
