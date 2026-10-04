import { useEffect, useRef, useState } from 'react';

interface AdSlotProps {
  minHeight?: string;
  className?: string;
  adSlot?: string; 
  adFormat?: string; 
}

export default function AdSlot({ minHeight = '250px', className = '', adSlot = '9791142997', adFormat = 'auto' }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adError, setAdError] = useState(false);
  const [canRenderAd, setCanRenderAd] = useState(false);
  const [isPushed, setIsPushed] = useState(false);

  // Measure container and only allow ad rendering when visible
  useEffect(() => {
    if (!containerRef.current) return;

    let observer: ResizeObserver | null = null;

    const checkWidth = () => {
      if (containerRef.current && containerRef.current.clientWidth > 0) {
        setCanRenderAd(true);
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    };

    if (containerRef.current.clientWidth > 0) {
      checkWidth();
    } else {
      observer = new ResizeObserver(() => checkWidth());
      observer.observe(containerRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  // Use a safe way to check for development or iframe preview environment
  const isDev = (import.meta as any).env?.DEV || 
    (typeof window !== 'undefined' && (
      window.location.hostname.includes('run.app') || 
      window.location.hostname.includes('localhost')
    ));

  // Now push the ad once the element is rendered in DOM
  useEffect(() => {
    if (!canRenderAd || isPushed || adError || isDev) return;

    const timeoutId = window.setTimeout(() => {
      if (!containerRef.current) return;
      const ins = containerRef.current.querySelector('.adsbygoogle') as HTMLElement;
      if (!ins || ins.hasAttribute('data-adsbygoogle-status')) {
        setIsPushed(true);
        return; // Already pushed or filled by another pass
      }

      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        setIsPushed(true);
      } catch (e: any) {
        console.error('AdSense push error:', e.message || e);
        if (e.message && e.message.includes('already have ads')) {
          setIsPushed(true);
          return;
        }
        setAdError(true);
      }
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [canRenderAd, isPushed, adError, isDev]);

  return (
    <div
      ref={containerRef}
      className={`border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${className}`}
      role="region"
      aria-label="Advertisement"
    >
      {/* Policy-compliant distinct header disclosure */}
      <div className="bg-neutral-100 border-b-2 border-black/20 px-3 py-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-neutral-500 select-none">
        <span>Advertisement</span>
        <span className="text-[9px] text-neutral-400 font-bold">Sponsored</span>
      </div>

      {/* Ad creative container with enforced minHeight to prevent CLS */}
      <div
        className="w-full flex items-center justify-center p-2 relative bg-neutral-50/50"
        style={{ minHeight }}
      >
        {adError || (isDev && !(window as any).adsbygoogle) ? (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <span className="bg-yellow-300 border-2 border-black px-2 py-0.5 text-xs font-black uppercase mb-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              AdSense Slot Preview
            </span>
            <span className="text-[11px] font-bold text-neutral-600 mt-1 uppercase tracking-tight">
              Format: {adFormat} • Slot: {adSlot}
            </span>
          </div>
        ) : (
          canRenderAd && (
            <ins
              className="adsbygoogle"
              style={{ display: 'block', minWidth: '250px', width: '100%', minHeight }}
              data-ad-client="ca-pub-6659085318131236"
              data-ad-slot={adSlot}
              data-ad-format={adFormat}
              data-full-width-responsive="true"
            />
          )
        )}
      </div>
    </div>
  );
}
