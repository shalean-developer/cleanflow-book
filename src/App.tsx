import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Booking from "./pages/Booking";
import BookingQuote from "./pages/BookingQuote";
import QuoteConfirmation from "./pages/QuoteConfirmation";
import BookingConfirmation from "./pages/BookingConfirmation";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CleanerDashboard from "./pages/CleanerDashboard";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import Locations from "./pages/Locations";
import ContactUs from "./pages/ContactUs";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/services" element={<Services />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/booking/quote" element={<BookingQuote />} />
            <Route path="/booking/quote/confirmation" element={<QuoteConfirmation />} />
            <Route 
              path="/booking/service/select" 
              element={<Booking />} 
            />
            <Route 
              path="/booking/service/:serviceName" 
              element={<Booking />} 
            />
            <Route 
              path="/booking/service/:serviceName/property" 
              element={<Booking />} 
            />
            <Route 
              path="/booking/service/:serviceName/schedule" 
              element={<Booking />} 
            />
            <Route 
              path="/booking/service/:serviceName/cleaner" 
              element={<Booking />} 
            />
            <Route 
              path="/booking/service/:serviceName/review" 
              element={<Booking />} 
            />
            <Route 
              path="/booking/confirmation" 
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/customer" 
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/cleaner" 
              element={
                <ProtectedRoute>
                  <CleanerDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
