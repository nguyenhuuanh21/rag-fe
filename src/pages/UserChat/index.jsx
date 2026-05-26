import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { chatUser, getChatHistory, logout, clearChatHistory, getAllConversations, createConversation, searchKeyword } from '../../services/Api';
import logo from "../../assets/logo.png";
import { formatDate } from "../../shared/ultils";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { logoutSuccess } from '../../redux-setup/reducers/auth';
import IconTrash from '../../shared/components/IconTrash';
import IconLogout from '../../shared/components/IconLogout';
import IconSend from '../../shared/components/IconSend';
import ActionBtn from '../../shared/components/ActionBtn';

const UserChat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useSelector(store => store.auth?.user?.current?.fullName);
    const chatId = useParams().chatId;
    const location = useLocation();
    // Core Logic States
    const [input, setInput] = useState("");
    const [conversation, setConversation] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clearHistory, setClearHistory] = useState(false);
    const [error, setError] = useState({ type: "", message: "" });
    const [nameChat, setNameChat] = useState("");
    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    // UI Layout States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default mở trên desktop
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);


    useEffect(() => {
        getAllConversations()
            .then(res => {
                console.log(res.data.conversations);
                setConversations(res.data.conversations)
                if (res.data.conversations.length > 0) {
                    navigate(`/chat/${res.data.conversations[0]._id}`);
                }
            })
            .catch(err => console.error(err));
    }, []);
    useEffect(() => {
        getChatHistory(chatId)
            .then(res => {
                console.log(res.data.conversation);
                setConversation(res.data.conversation)
            })
            .catch(err => console.error(err));
    }, [chatId]);



    // THAY BẰNG ĐOẠN NÀY
    useEffect(() => {
        // 1. Nếu có state truyền sang từ tìm kiếm -> cuộn đến tin nhắn đó
        if (conversation && conversation.length > 0 && location.state?.scrollToMsgId) {
            const element = document.getElementById(`msg-${location.state.scrollToMsgId}`);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.style.transition = "background-color 0.5s ease";
                    element.style.backgroundColor = "#fef08a";
                    setTimeout(() => {
                        element.style.backgroundColor = "transparent";
                    }, 1500);
                }, 100);
            }
            // Xóa state đi để lần gửi tin nhắn tiếp theo nó lại tự cuộn xuống cuối
            window.history.replaceState({}, document.title)
        }
        // 2. Nếu là chat bình thường -> cuộn xuống cuối
        else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation, loading, location.state]);

    const handleClearHistory = (e) => {
        e.preventDefault();
        clearChatHistory(chatId)
            .then((res) => {
                const updatedConversations =
                    conversations.filter(conv => conv._id !== chatId);

                setConversations(updatedConversations);

                if (updatedConversations.length > 0) {
                    navigate(`/chat/${updatedConversations[0]._id}`);
                } else {
                    navigate("/chat");
                }
            })
            .catch((err) => {
                console.error(err)
            });
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
        setError({ type: "", message: "" });
        if (!input.trim()) {
            setError({ type: "input", message: "Câu hỏi không được để trống" });
            return;
        }
        if (input.trim().length > 300) {
            setError({ type: "input", message: "Câu hỏi quá dài, vui lòng nhập ít hơn 300 ký tự" });
            return;
        }
        const inputValue = input;
        setConversation(prev => [...prev, { role: "user", content: inputValue, createdAt: new Date() }]);
        setInput("");
        setLoading(true);
        chatUser(chatId, { input: inputValue })
            .then(res => {
                setConversation(prev => [...prev, { role: "assistant", content: res.data.answer, createdAt: new Date() }]);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Chat error:", error?.response?.data || error);
                if (error.response && error.response.status === 400 || error.response.status === 429) {
                    setConversation(prev => prev.slice(0, -1));
                    setError({ type: "input", message: error?.response?.data.message });
                    setLoading(false);
                    return;
                }
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
    const handleCreateConversation = () => {
        setError({ type: "", message: "" });
        if (!nameChat.trim()) {
            setError({ type: "nameChat", message: "Tên cuộc trò chuyện không được để trống" });
            return;
        }
        createConversation({ name: nameChat.trim() })
            .then(res => {
                setShowNewChatModal(false);
                setNameChat("");
                setConversations(prev => [res.data.conversation, ...prev]);
                navigate(`/chat/${res.data.conversation._id}`);
            })
            .catch(err => {
                console.error("Create conversation error:", err?.response?.data.message || err);
                setError({ type: "nameChat", message: err?.response?.data?.message || "Không thể tạo cuộc trò chuyện mới" });
            })
    }
    const handleSearch = () => {
        console.log("Searching for:", keyword);
        setError({ type: "", message: "" });
        if (!keyword.trim()) {
            setError({ type: "searchKeyword", message: "Từ khóa tìm kiếm không được để trống" });
            return;
        }
        searchKeyword({ keyword: keyword.trim() })
            .then(res => {
                console.log(res.data);
                setSearchResults(res.data.results);
            })
            .catch(err => {
                console.error("Search error:", err);
                setError({ type: "searchKeyword", message: err?.response?.data?.message || "Không thể tìm kiếm" });
            });
    }
    return (
        <div className="font-sans bg-gray-100 flex relative overflow-hidden" style={{ height: "100dvh" }}>

            {/* ─── SIDEBAR OVERLAY (Mobile/Tablet) ─── */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ─── SIDEBAR ─── */}
            <aside className={`
                fixed inset-y-0 left-0 z-40
                flex flex-col bg-[#f9f9f9] border-r border-gray-200
                transition-all duration-300 ease-in-out
                ${isSidebarOpen
                    ? 'translate-x-0 w-[280px]'
                    : '-translate-x-full w-[280px] lg:translate-x-0 lg:w-0 lg:border-none lg:opacity-0 overflow-hidden'}
            `}>
                <div className="w-[280px] p-3 flex flex-col h-full shrink-0">
                    {/* Header Sidebar: New Chat & Toggle Close */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setShowNewChatModal(true)}
                            className="flex items-center gap-2 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors flex-1 text-sm font-medium text-gray-700"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Cuộc trò chuyện mới
                        </button>
                        {/* Nút đóng Sidebar */}
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 ml-1"
                            title="Đóng thanh bên"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                        </button>
                    </div>

                    {/* Button Tìm kiếm */}
                    <button
                        onClick={() => setShowSearchModal(true)}
                        className="flex items-center gap-2 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm font-medium text-gray-700 mb-4"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        Tìm kiếm trong chat
                    </button>

                    {/* Danh sách Chat */}
                    <div className="flex-1 overflow-y-auto">
                        <p className="text-xs font-semibold text-gray-400 px-3 mb-2">Gần đây</p>
                        <ul className="space-y-1">
                            {conversations.map((conv, index) => (
                                <Link to={`/chat/${conv._id}`} key={index}>
                                    <li className={`px-3 py-2  rounded-lg cursor-pointer text-sm text-gray-800  truncate ${chatId === conv._id ? "bg-gray-200 font-medium flex items-center justify-between" : "hover:bg-gray-200"} `} key={index}>
                                        <span>{conv.name}</span>
                                        {chatId === conv._id && (<div className="w-2 h-2 bg-utc-navy rounded-full"></div>)}
                                    </li>
                                </Link>

                            ))}
                        </ul>
                    </div>

                    {/* User Profile */}
                    <div className="mt-auto pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-3 px-3 py-2 hover:bg-gray-200 rounded-lg cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-utc-navy to-utc-purple text-white flex items-center justify-center text-sm font-bold shrink-0">SV</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{username}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ─── MAIN CHAT AREA ─── */}
            <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-gray-50 relative transition-all duration-300">

                {/* ── Mobile/Tablet Header ── */}
                <div className="lg:hidden flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-utc-navy to-utc-purple text-white shrink-0">
                    <div className="flex items-center gap-2">
                        {/* Nút Mở Sidebar cho Mobile */}
                        {!isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 hover:bg-white/20 rounded-lg transition" title="Mở thanh bên">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            </button>
                        )}
                        <img src={logo} alt="avatar" className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-white/30 shrink-0" />
                        <div className="flex-1 min-w-0 hidden sm:block">
                            <p className="text-xs md:text-sm font-semibold truncate">Sổ Tay Sinh Viên K63</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <ActionBtn light danger onClick={handleClearHistory} title="Xóa lịch sử chat"><IconTrash /></ActionBtn>
                        <ActionBtn light danger onClick={handleLogout} title="Đăng xuất"><IconLogout /></ActionBtn>
                    </div>
                </div>

                {/* ── Desktop Header ── */}
                <div className="hidden lg:flex items-center justify-between px-6 py-3 bg-gradient-to-br from-utc-navy to-utc-purple text-white shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        {/* Nút Mở Sidebar cho Desktop */}
                        {!isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/20 rounded-lg transition mr-1" title="Mở thanh bên">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                            </button>
                        )}
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow shrink-0">
                            <img src={logo} alt="avatar" className="w-full h-full object-cover bg-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-tight">Sổ Tay Sinh Viên Khóa 63</p>
                            <p className="text-xs opacity-75">Đại học Giao thông Vận tải</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ActionBtn light danger onClick={handleClearHistory} title="Xóa lịch sử chat">
                            <IconTrash /><span>Xóa chat</span>
                        </ActionBtn>
                        <ActionBtn light danger onClick={handleLogout} title="Đăng xuất">
                            <IconLogout /><span>Đăng xuất</span>
                        </ActionBtn>
                    </div>
                </div>

                {/* Messages area */}
                <div id="msgs" className="flex-1 min-h-0 overflow-y-auto px-4 py-5 md:px-6 flex flex-col gap-4 bg-gray-50">
                    {conversation.map((msg, idx) => {
                        if (msg.role === "user") {
                            return (
                                <div key={msg._id || idx} id={`msg-${msg._id}`} className="flex items-end gap-2 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm shadow shrink-0">👤</div>
                                    <div className="flex flex-col items-end">
                                        <div className="bg-gradient-to-br from-utc-navy to-utc-purple text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm shadow-sm max-w-xs md:max-w-md leading-relaxed">
                                            {msg.content}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1 mr-1">{formatDate(msg.createdAt)}</p>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <div key={msg._id || idx} id={`msg-${msg._id}`} className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden shadow shrink-0">
                                    <img src={logo} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-gray-800 shadow-sm max-w-xs md:max-w-md lg:max-w-lg leading-relaxed whitespace-pre-wrap">
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
                    <div className="max-w-4xl mx-auto flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-utc-navy/40 focus-within:ring-2 focus-within:ring-utc-navy/10 focus-within:bg-white transition-all">
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
                    {error.type === 'input' && <p className="mt-1.5 px-1 text-xs text-red-500 truncate text-center">{error.message}</p>}
                </div>
            </main>

            {/* ─── MODAL TẠO MỚI ─── */}
            {showNewChatModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="p-5 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">Tạo cuộc trò chuyện mới</h3>
                        </div>
                        <div className="p-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên cuộc trò chuyện</label>
                            <input
                                value={nameChat}
                                onChange={e => setNameChat(e.target.value)}
                                name="nameChat"
                                type="text"
                                placeholder="Nhập tên..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-utc-navy focus:border-transparent transition"
                            />
                            {error.type === 'nameChat' && <p className="mt-1.5 px-1 text-xs text-red-500 truncate text-center">{error.message}</p>}
                        </div>
                        <div className="p-5 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setShowNewChatModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition">
                                Hủy
                            </button>
                            <button onClick={handleCreateConversation} className="px-4 py-2 text-sm font-medium text-white bg-utc-navy hover:bg-utc-navy/90 rounded-lg transition">
                                Tạo mới
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── MODAL TÌM KIẾM ─── */}
            {showSearchModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-center pt-[10vh] px-4 sm:pt-[15vh]">
                    <div className="absolute inset-0" onClick={() => setShowSearchModal(false)}></div>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col relative max-h-[70vh] animate-fade-in-down">
                        <div className="flex items-center px-4 py-3 border-b border-gray-100">
                            <svg width="20" height="20" className="text-gray-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input
                                type="text"
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                                name="searchKeyword"
                                placeholder="Nhập từ khóa tìm kiếm chat..."
                                className="flex-1 bg-transparent border-none outline-none text-base text-gray-800 placeholder-gray-400"
                                autoFocus
                            />
                            {/* Nút Tìm Kiếm trong Modal */}
                            <button onClick={handleSearch} className="px-4 py-1.5 bg-utc-navy text-white text-sm font-medium rounded-lg hover:bg-utc-navy/90 transition ml-2 mr-3 shadow-sm">
                                Tìm kiếm
                            </button>
                            {/* Nút Đóng Modal (Dấu X) */}
                            <button onClick={() => {
                                setSearchResults([]);
                                setKeyword('');
                                setShowSearchModal(false)
                            }} className="p-1 hover:bg-gray-100 rounded text-gray-500 transition" title="Đóng">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        {error.type === 'searchKeyword' && <p className="mt-1.5 px-1 text-xs text-red-500 truncate text-center">{error.message}</p>}

                        {/* <div className="flex-1 overflow-y-auto p-2">
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-400 px-2 mb-2">Gần đây</p>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                                        <svg width="16" height="16" className="text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <span className="text-sm text-gray-700 truncate">Giải thích quy chế tín chỉ</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="flex-1 overflow-y-auto p-2">
                            {/* Kiểm tra nếu không có kết quả */}
                            {searchResults && searchResults.length === 0 ? (
                                <div className="p-6 text-center text-sm text-gray-500">
                                    Không tìm thấy kết quả nào phù hợp.
                                </div>
                            ) : (
                                /* Duyệt qua từng cuộc trò chuyện */
                                searchResults.map((conv) => (
                                    <div key={conv._id} className="mb-5">

                                        {/* Tên cuộc trò chuyện (Nhóm) */}
                                        <Link to={`/chat/${conv._id}`} className="flex items-center gap-2 px-2 mb-2 cursor-pointer " onClick={() => {
                                            setSearchResults([]);
                                            setKeyword('');
                                            setShowSearchModal(false)
                                        }
                                        }>
                                            <svg width="14" height="14" className="text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">
                                                {conv.name}
                                            </p>
                                        </Link>

                                        {/* Các tin nhắn match bên trong */}
                                        <div className="space-y-1 pl-2">
                                            {conv.matchedMessages.map((msg, index) => (
                                                <div
                                                    onClick={() => {
                                                        navigate(`/chat/${conv._id}`, {
                                                            state: { scrollToMsgId: msg.msgId }
                                                        });
                                                        setSearchResults([]);
                                                        setKeyword(''); 
                                                        setShowSearchModal(false)

                                                    }}
                                                    key={index}
                                                    // Khi click có thể gọi hàm navigate(`/chat/${conv._id}`) để nhảy vào đoạn chat đó
                                                    className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition flex flex-col gap-1"
                                                >
                                                    <span className="text-[10px] font-semibold text-gray-400">
                                                        {msg.role === 'user' ? 'Bạn' : 'Hệ thống'}
                                                    </span>
                                                    {/* line-clamp-2 giúp text chỉ hiện 2 dòng rồi cắt bớt bằng dấu ... */}
                                                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                                                        {msg.preview}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserChat;