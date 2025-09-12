import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Music, User, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import CurrencySelect from "./CurrencySelect";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useUser();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(navigate);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Music className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">MuseMind</span>
          </Link>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/about-us"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              About Us
            </Link>

            <Link
              to="/pricing"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Pricing
            </Link>

            <Link
              to="/contact-us"
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Contact Us
            </Link>

            <CurrencySelect />
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Credits */}
            {isLoggedIn && (
              <div className="flex items-center gap-2 px-4 py-1 bg-slate-800/50 rounded-full border border-purple-500/30">
                <span className="text-2xl">🎵</span>
                <span className="text-white font-medium">
                  {user?.credits || 0} Credits
                </span>
              </div>
            )}

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Button>
                </Link>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20">
            <div className="flex flex-col gap-4">
              {/* Mobile Navigation */}
              <Link
                to="/about-us"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
              >
                About Us
              </Link>

              <Link
                to="/pricing"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
              >
                Pricing
              </Link>

              <Link
                to="/contact-us"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white transition-colors px-2 py-1"
              >
                Contact Us
              </Link>

              <CurrencySelect />  

              {/* Mobile Credits */}
              {isLoggedIn && (
                <div className="flex items-center gap-2 px-2 py-1">
                  <span className="text-2xl">🎵</span>
                  <span className="text-white font-medium">
                    {user?.credits || 0} Credits
                  </span>
                </div>
              )}

              {/* Mobile Auth */}
              <div className="flex flex-col gap-2 px-2">
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
