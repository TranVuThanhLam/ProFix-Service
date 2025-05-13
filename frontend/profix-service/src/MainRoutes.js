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
import MainLayout from "./layout/CustomerLayout/CustomerLayout";
import HistoryBookings from "./pages/Customer/HistoryBookings/HistoryBookings";
import Personal from "./components/common/Personal/Personal";

function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/services"
          element={
            <MainLayout>
              <Services />
            </MainLayout>
          }
        />
        <Route
          path="/services/:id"
          element={
            <MainLayout>
              <ServiceDetail />
            </MainLayout>
          }
        />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/history-bookings"
          element={
            <MainLayout>
              <HistoryBookings />
            </MainLayout>
          }
        />
        <Route
          path="/personal"
          element={
            <MainLayout>
              <Personal />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
