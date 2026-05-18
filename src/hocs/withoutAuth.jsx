// withoutAuth.jsx

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export function withoutAuth(OriginalComponent) {
  return function AuthComponent(props) {
    const auth = useSelector((state) => state.auth.auth);

    return auth.isAuthenticated ? (
      <Navigate to="/chat" replace />
    ) : (
      <OriginalComponent {...props} />
    );
  };
}