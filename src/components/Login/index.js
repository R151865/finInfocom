import { useState } from "react";
import HOST from "../../constants/host";
import apiStatusConstants from "../../constants/apiStatusConstants";
import { TailSpin } from "react-loader-spinner";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import "./index.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const successLogin = (jwtToken) => {
    Cookies.set("jwtToken", jwtToken, { expires: 30 });
    navigate("/");
  };

  const isValidEmail = () => {
    if (email === "") {
      setErrorMsg("Email needed");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const isValidPassword = () => {
    if (password === "") {
      setErrorMsg("Invalid password");
      return false;
    }

    if (password.length < 3) {
      setErrorMsg("Password should contains atleast 3 chars");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const renderLoadingView = () => {
    return (
      <div className="login__loading">
        <TailSpin color="white" height="40px" />
      </div>
    );
  };

  const checkFormAndReturnResult = () => {
    if (!isValidEmail()) {
      return false;
    }

    if (!isValidPassword()) {
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const loginBackendAPI = async () => {
    setApiStatus(apiStatusConstants.loading);

    const body = {
      email,
      password,
    };

    const url = `${HOST}/api/user/auth`;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-csrf-token": "cnJmQDIwMjI=",
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    if (response.ok === true) {
      successLogin(data.token);
      setApiStatus(apiStatusConstants.success);
      // success
    } else {
      setApiStatus(apiStatusConstants.failure);
      setErrorMsg(data.message);
    }

    console.log("this is data", data);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (checkFormAndReturnResult()) {
      loginBackendAPI();
    }
  };

  const renderViewBasedOnApiStatus = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return renderLoadingView();
      case apiStatusConstants.failure:
        return "Login";
      case apiStatusConstants.success:
        return "Login";
      default:
        return "Login";
    }
  };

  const jwtToken = Cookies.get("jwtToken");
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login">
      {renderLoadingView()}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3 }}
        className="login__body"
      >
        <h1>LOGIN</h1>
        <form onSubmit={onSubmitForm} className="login__form">
          <div>
            <label htmlFor="email">EMAIL</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="example@gmail.com"
            />
          </div>
          <div>
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="* * * * * * * * *"
            />
          </div>

          <motion.button
            whileTap={{ scale: 1.1 }}
            className="login__button"
            type="submit"
          >
            {renderViewBasedOnApiStatus()}
          </motion.button>

          {errorMsg.length > 0 ? (
            <p className="login__errorMsg">{errorMsg}</p>
          ) : null}

          <div>
            <div className="form_bottomSection">
              <motion.button
                onClick={() => navigate("/register")}
                whileTap={{ scale: 1.1 }}
                type="button"
                className="form__registerBtn"
              >
                Register here
              </motion.button>
              <motion.button
                onClick={() => navigate("/create-password")}
                whileTap={{ scale: 1.1 }}
                type="button"
                className="form__forgetPasswordBtn"
              >
                Forget password ?
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
