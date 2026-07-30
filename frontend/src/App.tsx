import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AllAnnouncements from "@/pages/AllAnnouncements";
import AdminAssignEquipment from "@/pages/admin/AdminAssignEquipment";
import EquipmentHistoryPage from "./pages/admin/EquipmentHistoryPage";

// Page Imports
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// Auth Pages
import Login from "./pages/Login";
import StudentLogin from "./pages/student/StudentLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import RegisterAdmin from "./pages/admin/RegisterAdmin";
import StudentRegister from "./pages/student/StudentRegister";
import ForgotPassword from "./pages/student/ForgotPassword";

// Student Pages
import EmailVerification from "./pages/student/EmailVerification";
import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCheckout from "./pages/admin/Checkout";
import AdminHistory from "./pages/admin/History";

// Route Protection
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/announcements" element={<AllAnnouncements />} />
            <Route path="/" element={<Login />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<RegisterAdmin />} />
            <Route path="/student-register" element={<StudentRegister />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/home" element={<Index />} />

            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute type="student" />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute type="admin" />}>
              <Route path="/admin/equipment-history" element={<EquipmentHistoryPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/checkout" element={<AdminCheckout />} />
              <Route path="/admin/history" element={<AdminHistory />} />
              <Route path="/admin/announcements" element={<AdminAnnouncements />} />
              <Route path="/admin/assign-equipment" element={<AdminAssignEquipment />} />
            </Route>

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
