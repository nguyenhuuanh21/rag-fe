import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { loginSuccess } from '../../redux-setup/reducers/auth'
import { login } from '../../services/Api'

const Login = () => {
    const [data,setData]=useState({
        email:"",
        password:""
    });
    const [msg,setMsg]=useState(null);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleLogin=(e)=>{
        e.preventDefault();
        if(!data.email || !data.password){
            return;
        }
        console.log(data);
        
        login(data)
        .then((response) => {
            console.log(response.data);
            dispatch(loginSuccess(response.data));
            navigate('/chat');
        })
        .catch((error) => {
            console.error("Login failed:", error);
            if(error.response?.data?.message==="Password is incorrect"||error.response?.data?.message==="Email  is incorrect"){
                setMsg({ text: "Email hoặc mật khẩu không đúng." });
            }
        });
    }
    return (
        <form id="form-login" className="space-y-4" >
            {msg && <p className="text-red-500 text-xs mt-1">{msg.text}</p>}
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                <input onChange={(e)=>setData({...data,email:e.target.value})} name='email' type="email" placeholder="example@lms.utc.edu.vn" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" />
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Mật khẩu</label>
                <input onChange={(e)=>setData({...data,password:e.target.value})} name='password' type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" />
            </div>
            <div className="text-right">
                <a href="#" className="text-xs text-purple hover:underline">Quên mật khẩu?</a>
            </div>
            <button  onClick={(e)=>handleLogin(e)} className="w-full py-3 rounded-xl bg-utc text-white text-sm font-bold shadow-md hover:opacity-90 active:scale-[.98] transition-all">
                Đăng nhập
            </button>
            <p className="text-center text-xs text-gray-400 pt-1">
                Chưa có tài khoản?
                <Link to="/register" className="text-navy font-semibold ml-1 hover:underline">Đăng ký</Link>
            </p>
        </form>
    )
}

export default Login