import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('toolkitpro_cookie_consent');
    if (!hasConsented) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('toolkitpro_cookie_consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black text-white p-4 border-t-8 border-yellow-400 shadow-[0_-8px_0_0_rgba(0,0,0,0.1)]">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-black uppercase text-yellow-400 mb-1">Cookie & Privacy Notice</h3>
          <p className="text-sm text-gray-100">
            We use cookies to personalize content and ads, to provide social media features, and to analyze our traffic. We also share information about your use of our site with our advertising and analytics partners who may combine it with other information that you've provided to them or that they've collected from your use of their services. By using our site, you agree to our <Link to="/privacy" aria-label="Read our full Privacy Policy" className="underline font-bold text-white hover:text-yellow-400">Privacy Policy</Link> and <Link to="/terms" aria-label="Read our Terms of Service agreement" className="underline font-bold text-white hover:text-yellow-400">Terms of Service</Link>.
          </p>
        </div>
        <div className="flex-shrink-0">
          <button 
            onClick={handleAccept}
            className="bg-yellow-400 text-black px-8 py-3 font-black uppercase text-sm border-4 border-yellow-400 hover:bg-white hover:border-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );
}
