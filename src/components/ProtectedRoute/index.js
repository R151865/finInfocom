import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ component }) {
  const jwtToken = Cookies.get("jwtToken");

  if (jwtToken === undefined) {
    return <Navigate to="/login" />;
  }

  return component;
}
