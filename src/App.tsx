// Original App with just Home page
import { HelmetProvider } from "react-helmet-async";
import { SiteLayout } from "@/layouts/SiteLayout";
import Index from "./pages/Index";

const App = () => (
  <HelmetProvider>
    <SiteLayout>
      <Index />
    </SiteLayout>
  </HelmetProvider>
);

export default App;
