import { Routes, Route } from "react-router-dom";
import Login from "./authentication/Login/Login";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./authentication/Register/Register";

function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
