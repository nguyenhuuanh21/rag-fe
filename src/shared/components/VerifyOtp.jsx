import React, { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { verifyOtp } from '../../services/Api'

const VerifyOtp = () => {
    const [digits, setDigits] = useState(['', '', '', '', '', ''])
    const [msg, setMsg] = useState(null)
    const inputs = useRef([])
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ''

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return
        const newDigits = [...digits]
        newDigits[index] = value
        setDigits(newDigits)
        if (value && index < 5) {
            inputs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pasted.length === 6) {
            setDigits(pasted.split(''))
            inputs.current[5]?.focus()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setMsg(null)
        const otp = digits.join('')
        if (otp.length < 6) {
            setMsg({ text: 'Vui lòng nhập đủ 6 chữ số.', type: 'error' })
            return
        }
        verifyOtp({ email, otp })
            .then(() => {
                navigate('/reset-password')
            })
            .catch((error) => {
                const message = error.response?.data?.message
                setMsg({ text: message })
            })
    }

    return (
        <form className="space-y-4">
            <div className="mb-2">
                <h2 className="text-base font-bold text-gray-800 text-center">Xác nhận OTP</h2>
                <p className="text-xs text-gray-400 mt-1 text-center">
                    Nhập mã 6 chữ số đã gửi đến <span className="font-semibold text-gray-600">{email}</span>
                </p>
            </div>
            {msg && <p className="text-red-500 text-xs text-center">{msg.text}</p>}
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {digits.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => (inputs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className="w-full aspect-square text-center text-lg font-bold rounded-xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition"
                    />
                ))}
            </div>
            <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-xl bg-utc text-white text-sm font-bold shadow-md hover:opacity-90 active:scale-[.98] transition-all"
            >
                Xác nhận
            </button>
            <p className="text-center text-xs text-gray-400 pt-1">
                Không nhận được mã?
                <a href="/forgot-password" className="text-navy font-semibold ml-1 hover:underline">Gửi lại</a>
            </p>
        </form>
    )
}

export default VerifyOtp
