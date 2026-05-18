
import { Route, Routes } from 'react-router-dom'
import './App.css'
import UserChat from './pages/UserChat'
import Auth from './pages/Auth'
import Login from './shared/components/Login'
import Register from './shared/components/Register'
import { withAuth, withoutAuth } from "./hocs";
const ProtectedUserChat = withAuth(UserChat);
const GuestLogin = withoutAuth(Login);
const GuestRegister = withoutAuth(Register);
function App() {
  return (
    <>
      <Routes>
        <Route path="/chat" element={<ProtectedUserChat />} />
        <Route path="/" element={<Auth />} >
          <Route index element={<GuestLogin />} />
          <Route path="login" element={<GuestLogin />} />
          <Route path="register" element={<GuestRegister />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
