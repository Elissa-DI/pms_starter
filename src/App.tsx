import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashBoard from "./pages/AdminDashBoard";
import AdminSlotsPage from "./pages/AdminSlotsPage";
import UsersPage from "./pages/UsersPage";
import AdminUsers from "./pages/Users";
import ParkingReports from "./components/ParkingReports";
import CustomerDashboard from "./pages/CustomerDashBoard";
import CustomerParkingView from "./pages/CustomerParkingView";
import CustomerEntryDetails from "./components/CustomerEntryDetails";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />


            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin>
                  {/* <AdminDashBoard /> */}
                  <ParkingReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/parkings" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSlotsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requireAdmin>
                  <ParkingReports />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/customer/dashboard" 
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer/parkings" 
              element={
                <ProtectedRoute>
                  <CustomerParkingView />
                </ProtectedRoute>
              } 
            />

             <Route 
              path="/customer/checkout/:id" 
              element={
                <ProtectedRoute>
                  <CustomerEntryDetails />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
