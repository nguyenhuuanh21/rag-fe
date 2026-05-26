import { Link } from 'react-router-dom'
import { register } from '../../services/Api'
import { useState } from 'react'
const Register = () => {
    const [input, setInput] = useState({
        fullName: "",
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState({});
    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const handleRegister = (e) => {
        e.preventDefault();
        setErrors({});
        setMsg({});


        register(input)
            .then((response) => {
                console.log(response.data);
                setMsg({ text: "Đăng ký thành công! Vui lòng đăng nhập.", type: "success" });
                setErrors({});
            })
            .catch((error) => {
                console.error("Registration failed:", error);
                const message = error.response?.data?.message;
                const backendErrors = {};
                if (message === 'Email already exists') {
                    setMsg({ text: "Email đã tồn tại. Vui lòng sử dụng email khác.", type: "error" });
                }
                if (error.response?.data?.errors) {
                    error.response.data.errors.forEach((err) => {
                        backendErrors[err.path] = err.msg;
                    });
                    setErrors(backendErrors);
                } else if (message !== 'Email already exists') {
                    setMsg({ text: "Đăng ký thất bại. Vui lòng thử lại.", type: "error" });
                }
            });
    }
    return (
        <form id="form-register" className="space-y-4 ">
            {msg.text && (
                <p className={`text-center text-sm font-medium ${msg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {msg.text}
                </p>
            )}
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Họ và tên</label>
                <input value={input.fullName} onChange={handleChange} name="fullName" type="text" placeholder="Nguyễn Văn A" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                <input value={input.email} onChange={handleChange} name="email" type="email" placeholder="example@lms.utc.edu.vn" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Mật khẩu</label>
                <input value={input.password} onChange={handleChange} name="password" type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <button onClick={handleRegister} type="submit" className="w-full py-3 rounded-xl bg-utc text-white text-sm font-bold shadow-md hover:opacity-90 active:scale-[.98] transition-all">
                Tạo tài khoản
            </button>
            <p className="text-center text-xs text-gray-400 pt-1">
                Đã có tài khoản?
                <Link to="/login" className="text-navy font-semibold ml-1 hover:underline" >Đăng nhập</Link>
            </p>
        </form>



    )
}

export default Register