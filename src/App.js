import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CreatePassword from "./components/CreatePassword";
import ProtectedRoute from "./components/ProtectedRoute";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        exact
        path="/"
        element={<ProtectedRoute component={<Dashboard />} />}
      />
      <Route path="/create-password" element={<CreatePassword />} />
    </Routes>
  );
}

export default App;
