import "./index.css";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const onClickLogoutButton = () => {
    Cookies.remove("jwtToken");
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="header__body">
        <p className="header__logo">SB</p>

        <motion.button
          whileTap={{ scale: 1.1 }}
          onClick={onClickLogoutButton}
          type="button"
          className="logout_button"
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
}
