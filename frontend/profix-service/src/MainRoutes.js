import { Routes, Route } from "react-router-dom";
import Login from "./authentication/Login/Login";
import { BrowserRouter } from "react-router-dom";
import Register from "./authentication/Register/Register";
import Home from "./pages/Home/Home";

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
