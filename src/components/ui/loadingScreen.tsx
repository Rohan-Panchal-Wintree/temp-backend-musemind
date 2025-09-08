import React from "react";

type LoadingScreenProps = { message?: string };

// Single-component fullscreen modal with blur + black backdrop
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = "Music" }) => {
  // SVG path provided by the user
  const starPath =
    "M0 0 C0.99 0 1.98 0 3 0 C3.45439453 1.68802734 3.45439453 1.68802734 3.91796875 3.41015625 C10.57064511 27.90349112 17.01298134 49.2307309 40.01171875 62.7734375 C49.46571256 67.89761403 59.3254914 70.66707224 69.67919922 73.38525391 C72.79974402 74.21184046 75.89948627 75.10148378 79 76 C79 76.99 79 77.98 79 79 C78.31075439 79.15033691 77.62150879 79.30067383 76.91137695 79.45556641 C58.30598125 83.39422601 58.30598125 83.39422601 41 91 C40.0203125 91.556875 39.040625 92.11375 38.03125 92.6875 C18.80944426 104.26192066 11.68243774 123.29502571 6 144 C5.67644531 145.16660156 5.35289063 146.33320313 5.01953125 147.53515625 C4.33634635 150.02092292 3.66189015 152.50849479 3 155 C2.01 154.67 1.02 154.34 0 154 C-0.72416272 151.49918383 -1.26687683 149.11158457 -1.75 146.5625 C-6.0149226 126.57506693 -14.37128084 105.34652307 -32.05078125 93.71875 C-45.50004926 85.88076599 -59.91792306 82.40215688 -75 79 C-75 78.01 -75 77.02 -75 76 C-74.41734375 75.8548999 -73.8346875 75.7097998 -73.234375 75.56030273 C-50.85039467 69.91371493 -26.89203103 62.88265432 -13.75 42.25 C-6.5839507 29.35900773 -2.68051437 14.45146879 0 0 Z";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={message}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center">
        {/* Star box */}
        <div className="relative w-40 h-40  rounded-2xl">
          {/* Three animated sparkles with staggered delays */}
          <div
            className="absolute inset-0 flex items-center justify-center animate-sparkle-wave"
            style={{ animationDelay: "0s" }}
          >
            <svg
              className="w-10 h-10"
              viewBox="0 0 226 219"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="starGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <filter
                  id="starGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#starGlow)">
                <path
                  d={starPath}
                  transform="translate(109,27)"
                  fill="url(#starGradient)"
                />
              </g>
            </svg>
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center animate-sparkle-wave"
            style={{ animationDelay: "-1s" }}
          >
            <svg
              className="w-10 h-10"
              viewBox="0 0 226 219"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="starGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <filter
                  id="starGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#starGlow)">
                <path
                  d={starPath}
                  transform="translate(109,27)"
                  fill="url(#starGradient)"
                />
              </g>
            </svg>
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center animate-sparkle-wave"
            style={{ animationDelay: "-2s" }}
          >
            <svg
              className="w-10 h-10"
              viewBox="0 0 226 219"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="starGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <filter
                  id="starGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#starGlow)">
                <path
                  d={starPath}
                  transform="translate(109,27)"
                  fill="url(#starGradient)"
                />
              </g>
            </svg>
          </div>
        </div>
        {/* Generating text with pulse */}
        <p className="text-white/90 text-lg tracking-wide ai-shimmer">
          Generating {message}...
        </p>
      </div>
    </div>
  );
};

// Tailwind CSS keyframes for the star animation
const styles = `
  @keyframes sparkle-wave {
    0% { transform: scale(0.5) translate(-30px, -30px); opacity: 0; }
    33% { transform: scale(1.5) translate(0px, 0px); opacity: 1; }
    66% { transform: scale(0.5) translate(30px, 30px); opacity: 0; }
    100% { transform: scale(0.5) translate(-30px, -30px); opacity: 0; }
  }
  .animate-sparkle-wave { animation: sparkle-wave 3s linear infinite; }
`;

/* Shimmer text only */
const stylesText = `
  .ai-shimmer {
    display: inline-block;
    background: linear-gradient(90deg, #9ca3af 0%, #ffffff 40%, #9ca3af 80%);
    background-size: 200% 100%;
    background-position: 0% 0%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: ai-shimmer 2.2s linear infinite;
    letter-spacing: .08em;
    will-change: background-position;
  }
  @keyframes ai-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

// Inject only the star animation styles (no extra AI styles)
if (typeof document !== "undefined") {
  if (!document.getElementById("sparkle-wave-keyframes")) {
    const styleTag = document.createElement("style");
    styleTag.id = "sparkle-wave-keyframes";
    styleTag.innerHTML = styles;
    document.head.appendChild(styleTag);
  }
  if (!document.getElementById("shimmer-text-styles")) {
    const styleTag2 = document.createElement("style");
    styleTag2.id = "shimmer-text-styles";
    styleTag2.innerHTML = stylesText;
    document.head.appendChild(styleTag2);
  }
}

export default LoadingScreen;
