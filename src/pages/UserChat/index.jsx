import React, { useState } from 'react'
import { chatUser } from '../../services/Api';
import logo from "../../assets/logo.png";

const PDF_URL = "https://res.cloudinary.com/dybthajwz/image/upload/v1778940884/pdfs/cfa5475c-d2b0-450a-b022-1c554492280d.pdf";

const UserChat = () => {
    const [input, setInput] = useState("");
    const [pdfOpen, setPdfOpen] = useState(false);      // mobile drawer
    const [sidebarOpen, setSidebarOpen] = useState(false); // tablet slide-in

    const sendMessage = () => {
        chatUser(input).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.error(err);
        })
    }

    return (
        <div className="font-sans bg-gray-100 h-screen overflow-hidden flex relative">

            {/* ===== TABLET: overlay + slide-in sidebar ===== */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:block lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ===== PDF SIDEBAR ===== */}
            {/* Desktop: always visible | Tablet: slide-in | Mobile: hidden */}
            <aside className={`
                bg-white border-r border-gray-200 flex flex-col
                w-[45%] min-w-[45%]
                max-md:hidden
                lg:relative lg:translate-x-0
                max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-40 max-lg:shadow-xl max-lg:w-[340px] max-lg:min-w-[340px]
                max-lg:transition-transform max-lg:duration-300
                ${sidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}
            `}>
                {/* Header */}
                <div className="bg-gradient-to-br from-utc-navy to-utc-purple p-4 flex items-center gap-3 text-white shrink-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden shadow shrink-0">
                        <img src={logo} alt="logo" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold leading-tight">Sổ Tay Sinh Viên</p>
                        <p className="text-xs opacity-75">Đại học Giao thông Vận tải</p>
                    </div>
                    {/* Close btn - tablet only */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden w-8 h-8 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center text-sm"
                    >✕</button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50 shrink-0">
                    <span className="text-xs font-semibold text-utc-navy">📄 Sổ tay 2024</span>
                    <div className="flex-1" />
                    <a href={PDF_URL} target="_blank" rel="noreferrer"
                        className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition">
                        ↗ Mở rộng
                    </a>
                </div>

                {/* PDF iframe */}
                <div className="flex-1 bg-[#525659]">
                    <iframe src={PDF_URL} className="w-full h-full border-0" title="Sổ tay PDF" />
                </div>
            </aside>

            {/* ===== CHAT SECTION ===== */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Mobile top bar */}
                <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-utc-navy to-utc-purple text-white shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center text-lg">☰</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">🎓 Sổ Tay Sinh Viên</p>
                        <p className="text-xs opacity-75">Đại học Giao thông Vận tải</p>
                    </div>
                    <button
                        onClick={() => setPdfOpen(true)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/15 border border-white/25 shrink-0"
                    >📄 PDF</button>
                </div>

                {/* Tablet top bar */}
                <div className="hidden md:flex lg:hidden items-center gap-3 px-4 py-3 bg-gradient-to-r from-utc-navy to-utc-purple text-white shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center text-lg"
                    >☰</button>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">🎓 Sổ Tay Sinh Viên</p>
                        <p className="text-xs opacity-75">Đại học Giao thông Vận tải</p>
                    </div>
                    <button
                        onClick={() => setPdfOpen(true)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-white/15 border border-white/25 shrink-0"
                    >📄 PDF</button>
                </div>

                {/* Desktop header */}
                <div className="hidden lg:flex items-center gap-3 px-6 py-3 bg-white border-b border-gray-200 shadow-sm shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden shadow-md shrink-0">
                        <img src={logo} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">UTC Assistant – Sổ Tay Sinh Viên</p>
                        <p className="text-xs text-green-500 flex items-center gap-1.5">
                            <span className="blink w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                            Đang hoạt động
                        </p>
                    </div>
                    <button className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition text-sm">🗑️</button>
                </div>

                {/* Messages area */}
                <div id="msgs" className="flex-1 overflow-y-auto px-4 py-5 md:px-6 flex flex-col gap-4 bg-gray-50">

                    {/* Welcome card */}
                    <div className="rounded-2xl bg-gradient-to-br from-utc-navy to-utc-purple text-white p-5 text-center relative overflow-hidden">
                        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
                        <div className="absolute -bottom-6 -left-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
                        <p className="text-3xl mb-2">🎓</p>
                        <p className="font-bold text-base mb-1">Xin chào, Tân Sinh Viên UTC!</p>
                        <p className="text-xs opacity-85 leading-relaxed">Hỏi tôi về nội quy, học vụ, học bổng, ký túc xá...</p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4 relative z-10">
                            <span className="text-xs px-3 py-1.5 rounded-full bg-white/15 border border-white/25 cursor-pointer hover:bg-white/25 transition">📋 Học vụ</span>
                            <span className="text-xs px-3 py-1.5 rounded-full bg-white/15 border border-white/25 cursor-pointer hover:bg-white/25 transition">🏆 Học bổng</span>
                            <span className="text-xs px-3 py-1.5 rounded-full bg-white/15 border border-white/25 cursor-pointer hover:bg-white/25 transition">📝 Đăng ký môn</span>
                            <span className="text-xs px-3 py-1.5 rounded-full bg-white/15 border border-white/25 cursor-pointer hover:bg-white/25 transition">🏠 Ký túc xá</span>
                            <span className="text-xs px-3 py-1.5 rounded-full bg-white/15 border border-white/25 cursor-pointer hover:bg-white/25 transition">📅 Lịch học</span>
                        </div>
                    </div>

                    {/* Bot message */}
                    <div className="flex items-end gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shadow shrink-0">
                            <img src={logo} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-gray-800 shadow-sm max-w-xs leading-relaxed">
                                Chào bạn! 👋 Tôi sẵn sàng hỗ trợ mọi thắc mắc về <span className="text-utc-navy font-semibold">Sổ Tay Sinh Viên UTC</span>. 📖
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 ml-1">08:30</p>
                        </div>
                    </div>

                    {/* User message (sample) */}
                    <div className="flex items-end gap-2 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm shadow shrink-0">👤</div>
                        <div className="flex flex-col items-end">
                            <div className="bg-gradient-to-br from-utc-navy to-utc-purple text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm shadow-sm max-w-xs leading-relaxed">
                                Quy định học vụ như thế nào?
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 mr-1">08:31</p>
                        </div>
                    </div>

                    {/* Bot reply (sample) */}
                    <div className="flex items-end gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden shadow shrink-0">
                            <img src={logo} alt="avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-gray-800 shadow-sm max-w-sm leading-relaxed">
                                <b className="text-utc-navy">Quy định học vụ UTT:</b>
                                <ul className="list-disc pl-4 mt-2 space-y-1 text-gray-700">
                                    <li>Đăng ký tối thiểu <b>14 tín chỉ/học kỳ</b></li>
                                    <li>GPA tối thiểu không bị cảnh báo: <b>1.0/4.0</b></li>
                                    <li>Nghỉ quá 20% số tiết → cấm thi</li>
                                    <li>Thời gian đào tạo tối đa: <b>2× số năm chuẩn</b></li>
                                </ul>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 ml-1">08:31</p>
                        </div>
                    </div>

                    {/* Typing indicator (sample) */}
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
                </div>

                {/* Input bar */}
                <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
                    <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5
                        focus-within:border-utc-gold focus-within:ring-2 focus-within:ring-utc-navy/10 focus-within:bg-white transition-all">
                        <textarea
                            rows={1}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi về sổ tay sinh viên..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 resize-none max-h-28 leading-relaxed font-sans"
                        />
                        <button
                            onClick={sendMessage}
                            className="w-9 h-9 rounded-xl bg-gradient-to-br from-utc-navy to-utc-purple text-white flex items-center justify-center shadow-md hover:scale-105 hover:shadow-lg active:scale-95 transition-all shrink-0"
                        >➤</button>
                    </div>
                    <p className="text-[10px] text-gray-400 text-right mt-1.5">UTT Assistant · Enter để gửi</p>
                </div>
            </main>

            {/* ===== PDF DRAWER (mobile & tablet bottom sheet) ===== */}
            {pdfOpen && (
                <div className="fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setPdfOpen(false)}
                    />
                    {/* Sheet */}
                    <div className="absolute bottom-0 left-0 right-0 h-[75vh] bg-white rounded-t-2xl flex flex-col">
                        {/* Handle */}
                        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 shrink-0" />
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                            <p className="font-semibold text-gray-900 text-sm">📄 Sổ Tay Sinh Viên 2024</p>
                            <button
                                onClick={() => setPdfOpen(false)}
                                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
                            >✕</button>
                        </div>
                        {/* PDF */}
                        <div className="flex-1 bg-[#525659]">
                            <iframe src={PDF_URL} className="w-full h-full border-0" title="Sổ tay PDF mobile" />
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default UserChat