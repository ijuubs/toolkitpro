import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const OPEN_CONSENT_EVENT = 'toolkitpro:open-cookie-consent';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already made a consent choice
    const consent = localStorage.getItem('toolkitpro_cookie_consent');
    if (!consent) {
      setShow(true);
    }

    const handleOpenConsent = () => {
      setShow(true);
    };

    window.addEventListener(OPEN_CONSENT_EVENT, handleOpenConsent);
    return () => {
      window.removeEventListener(OPEN_CONSENT_EVENT, handleOpenConsent);
    };
  }, []);

  const updateGtagConsent = (status: 'granted' | 'denied') => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: status,
        ad_user_data: status,
        ad_personalization: status,
        analytics_storage: status
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem('toolkitpro_cookie_consent', 'granted');
    updateGtagConsent('granted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('toolkitpro_cookie_consent', 'denied');
    updateGtagConsent('denied');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div 
      role="dialog" 
      aria-labelledby="cookie-consent-title" 
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-0 left-0 right-0 z-[100] bg-black text-white p-4 sm:p-6 border-t-8 border-yellow-400 shadow-[0_-8px_0_0_rgba(0,0,0,0.2)]"
    >
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <h3 id="cookie-consent-title" className="text-lg sm:text-xl font-black uppercase text-yellow-400">
            Cookie & Privacy Preferences
          </h3>
          <p id="cookie-consent-desc" className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
            Your tool inputs, files, and calculations never leave your browser and are not uploaded to any server. Google Analytics and Google AdSense may use cookies for traffic measurement and ad personalization. Declining means ads will be non-personalised. For more details, see our <Link to="/privacy" className="underline font-bold text-yellow-400 hover:text-white">Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex flex-row items-center gap-3 w-full sm:w-auto shrink-0">
          <button 
            type="button"
            onClick={handleDecline}
            className="flex-1 sm:flex-initial px-6 py-3 bg-neutral-800 text-white font-black uppercase text-xs sm:text-sm border-2 border-white hover:bg-neutral-700 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-y-[2px] active:translate-x-[2px] min-h-[44px]"
          >
            Decline
          </button>
          <button 
            type="button"
            onClick={handleAccept}
            className="flex-1 sm:flex-initial px-6 py-3 bg-yellow-400 text-black font-black uppercase text-xs sm:text-sm border-2 border-black hover:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-y-[2px] active:translate-x-[2px] min-h-[44px]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
