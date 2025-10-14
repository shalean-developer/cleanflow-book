// Minimal safe App with Home page (no problematic dependencies)
import { HelmetProvider } from "react-helmet-async";
import { SiteLayout } from "@/layouts/SiteLayout";
import IndexMinimalSafe from "./pages/IndexMinimalSafe";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <SiteLayout>
        <IndexMinimalSafe />
      </SiteLayout>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
