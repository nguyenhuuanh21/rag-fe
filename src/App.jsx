
import { Route, Routes } from 'react-router-dom'
import './App.css'
import UserChat from './pages/UserChat'
import Auth from './pages/Auth'
import Login from './shared/components/Login'
import Register from './shared/components/Register'
import ForgotPassword from './shared/components/ForgotPassword'
import VerifyOtp from './shared/components/VerifyOtp'
import ResetPassword from './shared/components/ResetPassword'
import { withAuth, withoutAuth } from "./hocs";
const ProtectedUserChat = withAuth(UserChat);
const GuestLogin = withoutAuth(Login);
const GuestRegister = withoutAuth(Register);
const GuestForgotPassword= withoutAuth(ForgotPassword)
const GuestVerifyOtp = withoutAuth(VerifyOtp)
const GuestResetPassword = withoutAuth(ResetPassword)
function App() {
  return (
    <>
      <Routes>
        <Route path="/chat" element={<ProtectedUserChat />} />
        <Route path="/chat/:chatId" element={<ProtectedUserChat />} />
        <Route path="/" element={<Auth />} >
          <Route index element={<GuestLogin />} />
          <Route path="login" element={<GuestLogin />} />
          <Route path="register" element={<GuestRegister />} />
          <Route path="forgot-password" element={<GuestForgotPassword />} />
          <Route path="verify-otp" element={<GuestVerifyOtp />} />
          <Route path="reset-password" element={<GuestResetPassword />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
