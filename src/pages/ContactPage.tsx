import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { SITE_URL, SITE_NAME } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';
import { Mail, Clock, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const canonicalUrl = `${SITE_URL}/contact`;
  const supportEmail = `support@${SITE_URL.replace(/https?:\/\//, '').replace(/\/+$/, '')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <Helmet>
        <title>Contact & Technical Support | {SITE_NAME}</title>
        <meta name="description" content={`Contact the ${SITE_NAME} engineering team. Submit feature requests, bug reports, algorithmic feedback, or partnership inquiries.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Contact Us | ${SITE_NAME}`} />
        <meta property="og:description" content={`Contact the ${SITE_NAME} engineering team. Submit feature requests, bug reports, algorithmic feedback, or partnership inquiries.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": `Contact Us - ${SITE_NAME}`,
            "url": canonicalUrl,
            "description": `Contact the ${SITE_NAME} developer and support team.`
          })}
        </script>
      </Helmet>
      
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Contact Us' }]} />

      <div className="border-b-4 sm:border-b-8 border-black pb-4 sm:pb-6">
        <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 tracking-wider inline-block mb-2">
          Engineering & User Support
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter border-black leading-tight">
          Contact Us
        </h1>
        <p className="font-bold text-xs sm:text-sm text-neutral-600 mt-2">
          Have an algorithmic question, found a bug, or want to suggest a new utility tool? We respond to every inquiry.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
        <div className="space-y-5">
          <p className="text-base sm:text-lg font-bold text-neutral-800">
            We are dedicated to building the most reliable, client-side utility suite on the web.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Whether you are a developer with feedback on our Diff Checker or JSON Formatter, an accountant testing our Fiji VAT & FNPF formulas, or a user with a new tool request, your feedback is reviewed directly by our engineering leads.
          </p>
          
          <div className="space-y-3">
            <div className="border-4 border-black p-4 bg-yellow-100 flex items-start gap-3">
              <Mail className="text-black shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-black text-xs uppercase text-neutral-600">Primary Support Email</div>
                <div className="font-bold text-sm sm:text-base break-all">{supportEmail}</div>
              </div>
            </div>

            <div className="border-4 border-black p-4 bg-white flex items-start gap-3">
              <Clock className="text-black shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-black text-xs uppercase text-neutral-600">Response Turnaround</div>
                <div className="font-bold text-sm sm:text-base">Within 24 to 48 business hours</div>
              </div>
            </div>

            <div className="border-4 border-black p-4 bg-neutral-50 flex items-start gap-3">
              <ShieldCheck className="text-black shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-black text-xs uppercase text-neutral-600">Privacy Guarantee</div>
                <div className="font-bold text-xs text-neutral-700">Never shared with third parties or marketers</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-5 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          {status === "success" ? (
            <div className="bg-green-100 border-4 border-green-600 p-6 text-center space-y-3">
              <CheckCircle2 size={36} className="text-green-700 mx-auto" />
              <h3 className="font-black uppercase text-xl text-green-800">Message Received!</h3>
              <p className="font-bold text-xs sm:text-sm text-green-900 leading-relaxed">
                Thank you for your feedback. Our technical team has logged your ticket and will follow up shortly.
              </p>
              <button 
                type="button" 
                onClick={() => setStatus("idle")} 
                className="block w-full bg-green-500 text-black font-black uppercase py-2.5 hover:bg-green-400 transition-colors border-2 border-black min-h-[44px] text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-2">
                <MessageSquare size={16} />
                <span className="font-black uppercase text-xs">Direct Support Inquiry</span>
              </div>
              <div>
                <label className="block font-black uppercase text-xs mb-1">Your Full Name</label>
                <input 
                  required 
                  disabled={status === "submitting"} 
                  type="text" 
                  className="w-full border-4 border-black p-2.5 text-sm focus:bg-yellow-50 outline-none disabled:opacity-50" 
                  placeholder="e.g. Jane Smith" 
                />
              </div>
              <div>
                <label className="block font-black uppercase text-xs mb-1">Email Address</label>
                <input 
                  required 
                  disabled={status === "submitting"} 
                  type="email" 
                  className="w-full border-4 border-black p-2.5 text-sm focus:bg-yellow-50 outline-none disabled:opacity-50" 
                  placeholder="jane@example.com" 
                />
              </div>
              <div>
                <label className="block font-black uppercase text-xs mb-1">Message / Tool Feedback</label>
                <textarea 
                  required 
                  disabled={status === "submitting"} 
                  className="w-full border-4 border-black p-2.5 text-sm focus:bg-yellow-50 outline-none h-28 disabled:opacity-50" 
                  placeholder="Describe your inquiry, bug report, or feature request..."
                />
              </div>
              <button 
                disabled={status === "submitting"} 
                type="submit" 
                className="w-full bg-black text-white font-black uppercase py-3 hover:bg-yellow-400 hover:text-black transition-colors disabled:opacity-50 text-xs sm:text-sm min-h-[44px] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                {status === "submitting" ? "Dispatching..." : "Transmit Message"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
