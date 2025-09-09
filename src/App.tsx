import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Credits from "./pages/Credits";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AppProvider from "./contexts";
import Home from "./pages/Home";
import AccessGuard from "./utils/guestRoute";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { useEffect } from "react";
import { setNavigator } from "./utils/navigation";

const queryClient = new QueryClient();

function NavRegistrar() {
  const navigate = useNavigate();
  useEffect(() => setNavigator(navigate), [navigate]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <NavRegistrar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route
              path="/login"
              element={
                <AccessGuard mode="guest" redirectTo="/profile">
                  <Login />
                </AccessGuard>
              }
            />
            <Route
              path="/signup"
              element={
                <AccessGuard mode="guest" redirectTo="/profile">
                  <Signup />
                </AccessGuard>
              }
            />
            <Route path="/credits" element={<Credits />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/profile"
              element={
                <AccessGuard mode="protected" redirectTo="/login">
                  <Profile />
                </AccessGuard>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
