import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-6xl font-extrabold mb-4 text-purple-500">
          4<span className="inline-block mx-1">🎵</span>4
        </h1>
        <p className="text-2xl font-semibold mb-2">
          This page hit the wrong note
        </p>
        <p className="text-md text-gray-300 mb-6">
          The page you're looking for doesn’t exist — maybe it never made the
          charts.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded transition"
          >
            Return to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
