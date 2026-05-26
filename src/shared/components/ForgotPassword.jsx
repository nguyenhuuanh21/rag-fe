import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword } from '../../services/Api'
const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('ForgotPassword handleSubmit', email)
        if(!email) {
            setErrors({ email: 'Email không được để trống' })
            return  
        }
        forgotPassword({ email })
        .then((res) => {
            console.log(res);
            if(res.data.status === 'success') {
                navigate('/verify-otp', { state: { email } })
            }
        })
        .catch((err) => {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setErrors({ email: err.response.data.message });
            }
        })
    }


    return ( 
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="mb-2">
                <h2 className="text-base font-bold text-gray-800 text-center">Quên mật khẩu</h2>
                <p className="text-xs text-gray-400 mt-1 text-center">Nhập email để nhận mã OTP khôi phục mật khẩu</p>
            </div>
            {/* {msg && <p className="text-red-500 text-xs mt-1">{msg.text}</p>} */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    name="email"
                    type="email"
                    placeholder="example@lms.utc.edu.vn"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <button
                type="submit"
                className="w-full py-3 rounded-xl bg-utc text-white text-sm font-bold shadow-md hover:opacity-90 active:scale-[.98] transition-all"
            >
                Gửi mã OTP
            </button>
            <p className="text-center text-xs text-gray-400 pt-1">
                Nhớ mật khẩu rồi?
                <Link to="/login" className="text-navy font-semibold ml-1 hover:underline">Đăng nhập</Link>
            </p>
        </form>
    )
}

export default ForgotPassword
