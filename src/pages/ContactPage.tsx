import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { SITE_URL } from '../config/site';

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <Helmet>
        <title>Contact Us | ToolKitPro</title>
        <meta name="description" content="Reach out to the ToolKitPro team for support, feature requests, or business inquiries." />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:title" content="Contact Us | ToolKitPro" />
        <meta property="og:description" content="Reach out to the ToolKitPro team for support, feature requests, or business inquiries." />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | ToolKitPro" />
        <meta name="twitter:description" content="Reach out to the ToolKitPro team for support, feature requests, or business inquiries." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Us - ToolKitPro",
            "url": `${SITE_URL}/contact`,
            "description": "Reach out to the ToolKitPro team for support, feature requests, or business inquiries."
          })}
        </script>
      </Helmet>
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter border-b-4 sm:border-b-8 border-black pb-3 sm:pb-4 leading-tight">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
        <div className="space-y-4 sm:space-y-6">
          <p className="text-lg sm:text-xl font-bold">Have a question or a suggestion? We'd love to hear from you.</p>
          <p className="text-sm sm:text-base text-[var(--muted)]">Our team is committed to making ToolKitPro the best utility hub on the web. Your feedback directly impacts our development roadmap.</p>
          
          <div className="space-y-3 sm:space-y-4">
              <div className="border-4 border-black p-3.5 sm:p-4 bg-yellow-100 flex items-center justify-between gap-3">
                  <div className="font-black text-lg sm:text-2xl uppercase">Email</div>
                  <div className="font-bold underline text-xs sm:text-sm md:text-base break-all">support@toolkitpro.io</div>
              </div>
              <div className="border-4 border-black p-3.5 sm:p-4 bg-white flex items-center justify-between gap-3">
                  <div className="font-black text-lg sm:text-2xl uppercase">Twitter</div>
                  <div className="font-bold underline text-xs sm:text-sm md:text-base">@ToolKitPro_AI</div>
              </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-4 sm:p-6 md:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-3 sm:space-y-4">
            {status === "success" ? (
                <div className="bg-green-100 border-4 border-green-500 p-5 sm:p-6 text-center space-y-3 sm:space-y-4">
                    <h3 className="font-black uppercase text-xl sm:text-2xl text-green-700">Message Received!</h3>
                    <p className="font-bold text-sm sm:text-base text-green-800">We will get back to you within 24-48 hours.</p>
                    <button type="button" onClick={() => setStatus("idle")} className="block w-full bg-green-500 text-black font-black uppercase py-2.5 sm:py-2 hover:bg-green-400 transition-colors min-h-[44px] text-xs sm:text-sm">
                        Send Another Message
                    </button>
                </div>
            ) : (
                <>
                    <div>
                        <label className="block font-black uppercase text-xs sm:text-sm mb-1">Name</label>
                        <input required disabled={status === "submitting"} type="text" className="w-full border-4 border-black p-2.5 text-sm sm:text-base focus:bg-yellow-50 outline-none disabled:opacity-50" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block font-black uppercase text-xs sm:text-sm mb-1">Email</label>
                        <input required disabled={status === "submitting"} type="email" className="w-full border-4 border-black p-2.5 text-sm sm:text-base focus:bg-yellow-50 outline-none disabled:opacity-50" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block font-black uppercase text-xs sm:text-sm mb-1">Message</label>
                        <textarea required disabled={status === "submitting"} className="w-full border-4 border-black p-2.5 text-sm sm:text-base focus:bg-yellow-50 outline-none h-28 sm:h-32 disabled:opacity-50" placeholder="Tell us what's on your mind..."></textarea>
                    </div>
                    <button disabled={status === "submitting"} type="submit" className="w-full bg-black text-white font-black uppercase py-3 sm:py-4 hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-50 text-xs sm:text-sm min-h-[44px]">
                        {status === "submitting" ? "Sending..." : "Send Message"}
                    </button>
                </>
            )}
        </form>
      </div>
    </div>
  );
}
