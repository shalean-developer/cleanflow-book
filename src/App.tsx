// Minimal App for testing CSS deployment
import { HelmetProvider } from "react-helmet-async";
import { SiteLayout } from "@/layouts/SiteLayout";
import IndexMinimal from "./pages/IndexMinimal";

const App = () => (
  <HelmetProvider>
    <SiteLayout>
      <IndexMinimal />
    </SiteLayout>
  </HelmetProvider>
);

export default App;
