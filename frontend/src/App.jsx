import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Plans/Pricing";
import MerchantDashboard from "./pages/merchant/Dashboard";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-white">
      <div className="text-center">
        <div className="text-9xl mb-8 animate-bounce">404</div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #0a0a1a 0%, #3d1a5f 25%, #1a2947 50%, #5a2d82 75%, #0a0a1a 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          {/* MERCHANT */}
          <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
