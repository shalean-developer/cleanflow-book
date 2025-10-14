import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import { SiteLayout } from "@/layouts/SiteLayout";
import { GlobalStorageProtection } from "@/components/GlobalStorageProtection";
// import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
// TEMPORARILY DISABLED FOR HOME-ONLY DEPLOYMENT - UNCOMMENT TO RESTORE
// import Services from "./pages/Services";
// import HowItWorks from "./pages/HowItWorks";
// import Locations from "./pages/Locations";
// import SuburbDetail from "./pages/SuburbDetail";
// import ContactUs from "./pages/ContactUs";
// import Blog from "./pages/Blog";
// import BlogDetail from "./pages/BlogDetail";
// import NotFound from "./pages/NotFound";
// import ServiceSelect from "./pages/booking/ServiceSelect";
// import ServiceDetail from "./pages/booking/ServiceDetail";
// import Details from "./pages/booking/Details";
// import Schedule from "./pages/booking/Schedule";
// import Cleaner from "./pages/booking/Cleaner";
// import Review from "./pages/booking/Review";
// import Confirmation from "./pages/booking/Confirmation";
// import Quote from "./pages/booking/Quote";
// import QuoteConfirmation from "./pages/QuoteConfirmation";
// import Careers from "./pages/Careers";
// import Apply from "./pages/careers/Apply";
// import OurTeam from "./pages/OurTeam";
// import Reviews from "./pages/Reviews";
// import PrivacyPolicy from "./pages/PrivacyPolicy";
// import Terms from "./pages/Terms";
// import Cookies from "./pages/Cookies";
// import POPIA from "./pages/POPIA";
// import StandardCleaning from "./pages/services/StandardCleaning";
// import DeepCleaning from "./pages/services/DeepCleaning";
// import MoveInOut from "./pages/services/MoveInOut";
// import SpecializedServices from "./pages/services/SpecializedServices";
// import AirbnbCleaning from "./pages/services/AirbnbCleaning";
// import CarpetUpholstery from "./pages/services/CarpetUpholstery";
// import PostConstruction from "./pages/services/PostConstruction";
// import ManageBooking from "./pages/ManageBooking";
// import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
// import AdminDashboard from "./pages/dashboard/AdminDashboard";
// import CleanerDashboard from "./pages/dashboard/CleanerDashboard";
// import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <GlobalStorageProtection />
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SiteLayout>
              <Routes>
                {/* HOME PAGE ONLY - UNCOMMENT ROUTES BELOW TO RESTORE FULL SITE */}
                <Route path="/" element={<Home />} />
                
                {/* ALL OTHER ROUTES TEMPORARILY DISABLED */}
                {/* <Route path="/services" element={<Services />} />
                <Route path="/services/standard-cleaning" element={<StandardCleaning />} />
                <Route path="/services/deep-cleaning" element={<DeepCleaning />} />
                <Route path="/services/move-in-out" element={<MoveInOut />} />
                <Route path="/services/move-in-out-cleaning" element={<MoveInOut />} />
                <Route path="/services/specialized-services" element={<SpecializedServices />} />
                <Route path="/services/specialized" element={<SpecializedServices />} />
                <Route path="/services/airbnb-cleaning" element={<AirbnbCleaning />} />
                <Route path="/services/airbnb-turnover" element={<AirbnbCleaning />} />
                <Route path="/services/carpet-upholstery" element={<CarpetUpholstery />} />
                <Route path="/services/post-construction" element={<PostConstruction />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/locations/:slug" element={<SuburbDetail />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/booking/service/select" element={<ServiceSelect />} />
                <Route path="/booking/service/:slug" element={<ServiceDetail />} />
                <Route path="/booking/details" element={<Details />} />
                <Route path="/booking/schedule" element={<Schedule />} />
                <Route path="/booking/cleaner" element={<Cleaner />} />
                <Route path="/booking/review" element={<Review />} />
                <Route path="/booking/confirmation" element={<Confirmation />} />
                <Route path="/booking/quote" element={<Quote />} />
                <Route path="/quote/confirmation" element={<QuoteConfirmation />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/careers/apply" element={<Apply />} />
                <Route path="/our-team" element={<OurTeam />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/popia" element={<POPIA />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/admin" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/cleaner" 
                  element={
                    <ProtectedRoute requireCleaner>
                      <CleanerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/manage-booking" element={<ManageBooking />} />
                <Route path="*" element={<NotFound />} /> */}
              </Routes>
            </SiteLayout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
