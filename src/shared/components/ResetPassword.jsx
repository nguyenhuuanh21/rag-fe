import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { resetPassword } from '../../services/Api'

const ResetPassword = () => {
    const [data, setData] = useState({ newPassword: '', confirmPassword: '' })
    const [msg, setMsg] = useState(null)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setMsg(null)
        setErrors({})
        const { newPassword, confirmPassword } = data
        newPassword.length < 3 && setErrors(prev => ({ ...prev, newPassword: 'Mật khẩu phải có ít nhất 3 ký tự' }))
        confirmPassword !== newPassword && setErrors(prev => ({ ...prev, confirmPassword: 'Mật khẩu xác nhận không khớp' }))
        if(newPassword.length < 3 || confirmPassword !== newPassword) return
        resetPassword({ newPassword })
            .then(() => {
                setMsg({ text: 'Đặt lại mật khẩu thành công!', type: 'success' })
            })
            .catch((error) => {
                const message = error.response?.data?.message
                setMsg({ text: message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.', type: 'error' })
            })
    }

    return (
        <form className="space-y-4">
            <div className="mb-2">
                <h2 className="text-base font-bold text-gray-800">Đặt lại mật khẩu</h2>
                <p className="text-xs text-gray-400 mt-1">Nhập mật khẩu mới cho tài khoản của bạn</p>
            </div>
            {msg && (
                <p className={`text-xs mt-1 ${msg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                    {msg.text}
                </p>
            )}
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Mật khẩu mới</label>
                <input
                    onChange={(e) => setData({ ...data, newPassword: e.target.value })}
                    value={data.newPassword}
                    name="newPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition"
                />
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Xác nhận mật khẩu</label>
                <input
                    onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                    value={data.confirmPassword}
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition"
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-utc text-white text-sm font-bold shadow-md hover:opacity-90 active:scale-[.98] transition-all"
            >
                Xác nhận
            </button>
            <p className="text-center text-xs text-gray-400 pt-1">
                Nhớ mật khẩu rồi?
                <a href="/login" className="text-navy font-semibold ml-1 hover:underline">Đăng nhập</a>
            </p>
        </form>
    )
}

export default ResetPassword
