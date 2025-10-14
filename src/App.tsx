import { HelmetProvider } from "react-helmet-async";
import { SiteLayout } from "@/layouts/SiteLayout";
import Home from "./pages/Home";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <SiteLayout>
        <Home />
      </SiteLayout>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
