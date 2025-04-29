import { Routes, Route } from "react-router-dom";
import Login from "./authentication/Login/Login";
import { BrowserRouter } from "react-router-dom";
import Register from "./authentication/Register/Register";
import Home from "./pages/Home/Home";
import Logout from "./utils/Logout";
import Chat from "./pages/Chat/Chat";
import Services from "./components/Services/Services";
import ProviderDashboard from "./pages/ProviderDashboard/ProviderDashboard";
import ServiceDetail from "./components/Services/ServiceDetail/ServiceDetail";

function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
