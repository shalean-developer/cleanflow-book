// Safe App with Home page (no problematic dependencies)
import { HelmetProvider } from "react-helmet-async";
import { SiteLayout } from "@/layouts/SiteLayout";
import IndexSafe from "./pages/IndexSafe";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <SiteLayout>
        <IndexSafe />
      </SiteLayout>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
