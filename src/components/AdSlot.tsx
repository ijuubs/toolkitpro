import { useEffect, useRef, useState } from 'react';

interface AdSlotProps {
  minHeight?: string;
  className?: string;
  adSlot?: string; 
  adFormat?: string; 
}

export default function AdSlot({ minHeight = '250px', className = '', adSlot, adFormat }: AdSlotProps) {
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

    let timeoutId = window.setTimeout(() => {
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

  if (adError || (isDev && !(window as any).adsbygoogle)) {
    return (
      <div className={`my-8 ${className} bg-yellow-50 border-4 border-dashed border-black flex flex-col items-center justify-center text-xs text-black font-black uppercase p-4`} style={{ minHeight }}>
        <span className="bg-yellow-400 px-2 mb-1">Ad Slot</span>
        <span>{adFormat || 'AUTO'} - {adSlot || 'Auto'}</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`block w-full min-w-[250px] max-w-full overflow-hidden my-8 ${className} z-0 relative`} style={{ minHeight }}>
      <div className="absolute top-0 left-0 text-[10px] uppercase font-black tracking-widest text-gray-600 bg-white/80 px-1 select-none pointer-events-none z-10">
        Advertisement
      </div>
      {canRenderAd && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '250px', width: '100%' }}
          data-ad-client="ca-pub-6659085318131236"
          data-ad-slot={adSlot || "9791142997"}
          data-ad-format={adFormat || 'auto'}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
