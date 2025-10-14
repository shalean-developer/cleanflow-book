import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SiteLayout } from "@/layouts/SiteLayout";
import Home from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <Router>
        <SiteLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </SiteLayout>
      </Router>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
