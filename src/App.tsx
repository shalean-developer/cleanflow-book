import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import Locations from "./pages/Locations";
import ContactUs from "./pages/ContactUs";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import ServiceSelect from "./pages/booking/ServiceSelect";
import ServiceDetail from "./pages/booking/ServiceDetail";
import Details from "./pages/booking/Details";
import Schedule from "./pages/booking/Schedule";
import Cleaner from "./pages/booking/Cleaner";
import Review from "./pages/booking/Review";
import Confirmation from "./pages/booking/Confirmation";
import Quote from "./pages/booking/Quote";
import QuoteConfirmation from "./pages/QuoteConfirmation";

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
            <Route path="/services" element={<Services />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/booking/service/select" element={<ServiceSelect />} />
            <Route path="/booking/service/:slug" element={<ServiceDetail />} />
            <Route path="/booking/details" element={<Details />} />
            <Route path="/booking/schedule" element={<Schedule />} />
            <Route path="/booking/cleaner" element={<Cleaner />} />
            <Route path="/booking/review" element={<Review />} />
            <Route path="/booking/confirmation" element={<Confirmation />} />
            <Route path="/booking/quote" element={<Quote />} />
            <Route path="/quote/confirmation" element={<QuoteConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
