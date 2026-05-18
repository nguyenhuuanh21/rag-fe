import React from 'react'
import Login from '../../shared/components/Login'
import Register from '../../shared/components/Register'
import { Link, Outlet, useLocation } from 'react-router-dom'
import logo from '../../assets/logo.png'
const Auth = () => {
  const location = useLocation()
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="
    bg-utc
    flex flex-col justify-between
    px-6 pt-10 pb-6
    md:flex-row md:items-center md:px-6 md:py-4
    lg:flex-col lg:items-start lg:justify-between lg:w-[420px] lg:shrink-0 lg:p-12
  ">
          {/* Logo */}
          <div
            className="
    w-14 h-14 rounded-2xl bg-white/20 border border-white/30 mb-4 overflow-hidden
    md:w-9 md:h-9 md:rounded-xl md:mb-0 md:shrink-0
    lg:w-16 lg:h-16 lg:rounded-2xl lg:mb-0
  "
          >
            <img
              src={logo}
              alt="logo"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Title block */}
          <div className="
mb-6
md:mb-0 md:ml-3 md:flex-1
lg:ml-0 lg:mb-0
    ">
            {/* mobile + desktop label */}
            <p className="
  text-white/60 text-xs font-medium mb-0.5
  md:hidden
  lg:block lg:text-sm lg:mb-2
">Đại học Giao thông Vận tải</p>
            {/* tablet: single line name */}
            <p className="hidden md:block lg:hidden text-white text-sm font-bold">UTC Assistant</p>
            <p className="hidden md:block lg:hidden text-white/60 text-xs">Đại học Giao thông Vận tải</p>
            {/* desktop: big heading */}
            <h1 className="
  text-white text-xl font-black leading-snug
  md:hidden
  lg:block lg:text-3xl lg:mb-4
">UTC Assistant</h1>
            <p className="
  text-white/60 text-xs leading-relaxed
  md:hidden
  lg:block lg:text-sm
">
              Đăng nhập để truy cập trợ lý tư vấn sinh viên UTC khóa 63— tra cứu học vụ, quy chế, học bổng và nhiều hơn nữa.
            </p>
          </div>
          {/* Footer: desktop only */}
          <p className="text-white/30 text-xs hidden lg:block">© 2022 UTC Assistant</p>
        </div>
        {/* ── RIGHT / MAIN FORM AREA ──────────
  mobile : white card pulls up over header
  tablet : centered card on gray bg
  desktop: centered form on gray-50
  ──────────────────────────────────────── */}
        <div className="
    flex-1 bg-white rounded-t-3xl -mt-4 px-6 pt-6 pb-10
    md:rounded-none md:mt-0 md:flex md:items-center md:justify-center md:p-8 md:bg-gray-100
    lg:bg-gray-50
  ">
          {/* Card wrapper: tablet wraps in white card, mobile/desktop no extra card */}
          <div className="
w-full
md:bg-white md:rounded-2xl md:shadow-lg md:overflow-hidden md:max-w-md
lg:max-w-sm lg:bg-transparent lg:shadow-none lg:rounded-none
    ">
            {/* Tab bar */}
            <div className="
  flex border-b border-gray-100 mb-6
  md:mb-0
">
              <button id="tab-login" className={`flex-1 py-3 md:py-4 text-sm ${location.pathname === '/login' || location.pathname === '/' ? 'font-semibold text-navy border-b-2 border-navy' : 'font-medium text-gray-400 border-b-2 border-transparent'} transition-all`}>
                <Link to="/login">Đăng nhập</Link>
              </button>
              <button id="tab-register" className={`flex-1 py-3 md:py-4 text-sm ${location.pathname === '/register' ? 'font-semibold text-navy border-b-2 border-navy' : 'font-medium text-gray-400 border-b-2 border-transparent'} transition-all`}>
                <Link to="/register">Đăng ký</Link>
              </button>
            </div>
            {/* Forms */}
            <div className="md:p-8 lg:p-0 lg:mt-8">

              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Auth