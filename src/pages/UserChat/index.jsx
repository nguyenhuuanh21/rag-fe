import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { chatUser, getChatHistory, logout, clearChatHistory } from '../../services/Api';
import logo from "../../assets/logo.png";
import { formatDate } from "../../shared/ultils";
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../redux-setup/reducers/auth';
import IconTrash from '../../shared/components/IconTrash';
import IconLogout from '../../shared/components/IconLogout';
import IconPdfShow from '../../shared/components/IconPdfShow';
import IconPdfHide from '../../shared/components/IconPdfHide';
import IconSend from '../../shared/components/IconSend';
import ActionBtn from '../../shared/components/ActionBtn';
const PDF_URL = import.meta.env.VITE_PDF_URL;

const UserChat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [desktopPdfOpen, setDesktopPdfOpen] = useState(true);
    const [clearHistory, setClearHistory] = useState(false);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        getChatHistory()
            .then(res => setConversation(res.data.conversation))
            .catch(err => console.error(err));
    }, [clearHistory]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation, loading]);

    const handleClearHistory = (e) => {
        e.preventDefault();
        clearChatHistory()
            .then(() => {
                setConversation([]);
                setClearHistory(prev => !prev);
            })
            .catch(err => console.error(err));
    };

    const handleLogout = () => {
        logout()
            .then(() => {
                dispatch(logoutSuccess());
                navigate("/login");
            })
            .catch(err => console.error("Logout failed:", err));
    };

    const sendMessage = () => {
        if (!input.trim() || loading) return;
        const inputValue = input;
        setConversation(prev => [...prev, { role: "user", content: inputValue, createdAt: new Date() }]);
        setInput("");
        setLoading(true);
        chatUser({ input: inputValue })
            .then(res => {
                setConversation(prev => [...prev, { role: "assistant", content: res.data.answer, createdAt: new Date() }]);
                setLoading(false);
            })
            .catch(() => {
                setConversation(prev => [...prev, { role: "assistant", content: 'Đã có lỗi xảy ra, vui lòng thử lại sau!', createdAt: new Date() }]);
                setLoading(false);
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="font-sans bg-gray-100 flex relative" style={{ height: "100dvh", overflow: "hidden" }}>

            {/* Tablet overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:block lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ===== PDF SIDEBAR ===== */}
            {/* Header đã được chuyển sang phần chat — sidebar chỉ còn toolbar + iframe */}
            <aside className={`
                bg-white border-r border-gray-200 flex flex-col
                w-[45%] min-w-[45%]
                max-md:hidden
                lg:relative lg:translate-x-0
                max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-40 max-lg:shadow-xl max-lg:w-[340px] max-lg:min-w-[340px]
                max-lg:transition-transform max-lg:duration-300
                ${sidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}
                ${!desktopPdfOpen ? 'lg:hidden' : ''}
            `}>
                {/* Toolbar nhỏ — không còn header logo */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50 shrink-0">
                    <span className="text-xs font-semibold text-utc-navy">📄 Sổ tay 2024</span>
                    <div className="flex-1" />
                    <a href={PDF_URL} target="_blank" rel="noreferrer"
                        className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition">
                        ↗ Mở rộng
                    </a>
                    {/* Nút đóng sidebar trên tablet */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
                    >✕</button>
                </div>

                <div className="flex-1 bg-[#525659]">
                    <iframe src={PDF_URL} className="w-full h-full border-0" title="Sổ tay PDF" />
                </div>
            </aside>

            {/* ===== CHAT SECTION ===== */}
            <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">

                {/* ── Mobile top bar ── */}
                <div className="md:hidden flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-utc-navy to-utc-purple text-white shrink-0">
                    <img src={logo} alt="avatar"
                        className="w-9 h-9 rounded-full object-cover border border-white/30 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">Sổ Tay Sinh Viên</p>
                        <p className="text-[10px] opacity-70">UTC</p>
                    </div>
                    {/* PDF */}
                    <ActionBtn light onClick={() => setPdfOpen(true)} title="Xem PDF">
                        <IconPdfShow />
                        <span>PDF</span>
                    </ActionBtn>
                    {/* Xóa lịch sử */}
                    <ActionBtn light danger onClick={handleClearHistory} title="Xóa lịch sử chat">
                        <IconTrash />
                    </ActionBtn>
                    {/* Đăng xuất */}
                    <ActionBtn light danger onClick={handleLogout} title="Đăng xuất">
                        <IconLogout />
                    </ActionBtn>
                </div>

                {/* ── Tablet top bar ── */}
                <div className="hidden md:flex lg:hidden items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-utc-navy to-utc-purple text-white shrink-0">
                    <img src={logo} alt="avatar"
                        className="w-10 h-10 rounded-full object-cover border border-white/30 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">Sổ Tay Sinh Viên</p>
                        <p className="text-xs opacity-70">Đại học Giao thông Vận tải</p>
                    </div>
                    {/* PDF */}
                    <ActionBtn light onClick={() => setPdfOpen(true)} title="Xem PDF">
                        <IconPdfShow />
                        <span>PDF</span>
                    </ActionBtn>
                    {/* Xóa lịch sử */}
                    <ActionBtn light danger onClick={handleClearHistory} title="Xóa lịch sử chat">
                        <IconTrash />
                        <span>Xóa</span>
                    </ActionBtn>
                    {/* Đăng xuất */}
                    <ActionBtn light danger onClick={handleLogout} title="Đăng xuất">
                        <IconLogout />
                        <span>Đăng xuất</span>
                    </ActionBtn>
                </div>

                {/* ── Desktop header — nay hiển thị logo + tên trường đầy đủ ── */}
                <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-utc-navy to-utc-purple text-white shrink-0">
                    {/* Logo */}
                    <div className="w-11 h-11 rounded-xl overflow-hidden shadow shrink-0">
                        <img src={logo} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    {/* Tên trường + tiêu đề assistant */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight">UTC Assistant – Sổ Tay Sinh Viên</p>
                        <p className="text-xs opacity-75">Đại học Giao thông Vận tải</p>
                    </div>

                    {/* Toggle PDF sidebar */}
                    <ActionBtn light onClick={() => setDesktopPdfOpen(v => !v)} title={desktopPdfOpen ? 'Ẩn PDF' : 'Hiện PDF'}>
                        {desktopPdfOpen ? <><IconPdfHide /><span>Ẩn PDF</span></> : <><IconPdfShow /><span>PDF</span></>}
                    </ActionBtn>

                    {/* Xóa lịch sử */}
                    <ActionBtn light danger onClick={handleClearHistory} title="Xóa lịch sử chat">
                        <IconTrash />
                        <span>Xóa</span>
                    </ActionBtn>

                    {/* Đăng xuất */}
                    <ActionBtn light danger onClick={handleLogout} title="Đăng xuất">
                        <IconLogout />
                        <span>Đăng xuất</span>
                    </ActionBtn>
                </div>

                {/* Messages area */}
                <div id="msgs" className="flex-1 min-h-0 overflow-y-auto px-4 py-5 md:px-6 flex flex-col gap-4 bg-gray-50">
                    {conversation.map((msg, idx) => {
                        if (msg.role === "user") {
                            return (
                                <div key={idx} className="flex items-end gap-2 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm shadow shrink-0">👤</div>
                                    <div className="flex flex-col items-end">
                                        <div className="bg-gradient-to-br from-utc-navy to-utc-purple text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm shadow-sm max-w-xs leading-relaxed">
                                            {msg.content}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 mr-1">{formatDate(msg.createdAt)}</p>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={idx} className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden shadow shrink-0">
                                    <img src={logo} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-gray-800 shadow-sm max-w-xs leading-relaxed">
                                        {msg.content}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 ml-1">{formatDate(msg.createdAt)}</p>
                                </div>
                            </div>
                        );
                    })}

                    {loading && (
                        <div className="flex items-end gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden shadow shrink-0">
                                <img src={logo} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3.5 flex gap-1.5 shadow-sm">
                                <span className="d1 w-2 h-2 rounded-full bg-utc-navy inline-block" />
                                <span className="d2 w-2 h-2 rounded-full bg-utc-navy inline-block" />
                                <span className="d3 w-2 h-2 rounded-full bg-utc-navy inline-block" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input bar */}
                <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
                    <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5
                        focus-within:border-utc-gold focus-within:ring-2 focus-within:ring-utc-navy/10 focus-within:bg-white transition-all">
                        <textarea
                            ref={textareaRef}
                            rows={2}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nhập câu hỏi về sổ tay sinh viên..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 resize-none overflow-y-auto leading-relaxed font-sans"
                            style={{ height: '44px' }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="w-9 h-9 rounded-xl bg-gradient-to-br from-utc-navy to-utc-purple text-white flex items-center justify-center shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <IconSend />
                        </button>
                    </div>
                </div>
            </main>

            {/* ===== PDF Drawer (mobile & tablet) ===== */}
            {pdfOpen && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setPdfOpen(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-2xl flex flex-col shadow-2xl">
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 shrink-0" />
                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                            <div className="flex items-center gap-2">
                                <IconPdfShow />
                                <p className="font-semibold text-gray-900 text-sm">Sổ Tay Sinh Viên 2024</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a href={PDF_URL} target="_blank" rel="noreferrer"
                                    className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition">
                                    ↗ Mở rộng
                                </a>
                                <button
                                    onClick={() => setPdfOpen(false)}
                                    className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition"
                                >✕</button>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#525659]">
                            <iframe src={PDF_URL} className="w-full h-full border-0" title="Sổ tay PDF mobile" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserChat;