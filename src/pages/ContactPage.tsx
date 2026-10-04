import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';
import { Mail, MessageSquare, CheckCircle2, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<"idle" | "submitted">("idle");
  const canonicalUrl = `${SITE_URL}/contact`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailSubject = subject.trim() ? subject.trim() : `ToolKitPro Inquiry from ${name || 'User'}`;
    const mailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    
    // Open the user's default email client
    window.location.href = mailtoUrl;
    setStatus("submitted");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <Helmet>
        <title>Contact & Feedback | {SITE_NAME}</title>
        <meta name="description" content={`Contact ${SITE_NAME}. Send tool suggestions, bug reports, algorithmic feedback, or general inquiries.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Contact Us | ${SITE_NAME}`} />
        <meta property="og:description" content={`Contact ${SITE_NAME}. Send tool suggestions, bug reports, algorithmic feedback, or general inquiries.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": `Contact Us - ${SITE_NAME}`,
            "url": canonicalUrl,
            "description": `Contact the developer of ${SITE_NAME}.`
          })}
        </script>
      </Helmet>
      
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Contact Us' }]} />

      <div className="border-b-4 sm:border-b-8 border-black pb-4 sm:pb-6">
        <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 tracking-wider inline-block mb-2">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter border-black leading-tight">
          Contact Us
        </h1>
        <p className="font-bold text-xs sm:text-sm text-neutral-600 mt-2">
          Have a calculation question, found a bug, or want to suggest a new utility tool? Send an email directly.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
        <div className="space-y-5">
          <p className="text-base sm:text-lg font-bold text-neutral-800">
            ToolKitPro is built and maintained as a free, independent utility platform.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Whether you have feedback on a specific calculator, noticed a calculation discrepancy, or have an idea for a useful tool, feel free to reach out via email.
          </p>
          
          <div className="space-y-3">
            <div className="border-4 border-black p-4 bg-yellow-100 flex items-start gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Mail className="text-black shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-black text-xs uppercase text-neutral-600">Email Address</div>
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-black text-sm sm:text-base break-all underline hover:text-yellow-700">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            <div className="border-4 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-bold text-xs text-neutral-700 leading-relaxed">
                Submitting the form below will open your default email application with your message pre-filled to <span className="font-mono font-bold">{CONTACT_EMAIL}</span>.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-4 border-black p-5 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          {status === "submitted" ? (
            <div className="bg-green-100 border-4 border-green-600 p-6 text-center space-y-3">
              <CheckCircle2 size={36} className="text-green-700 mx-auto" />
              <h3 className="font-black uppercase text-xl text-green-800">Email Client Opened</h3>
              <p className="font-bold text-xs sm:text-sm text-green-900 leading-relaxed">
                Your email app should have opened. If it did not open automatically, please send your email directly to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-black">{CONTACT_EMAIL}</a>.
              </p>
              <button 
                type="button" 
                onClick={() => setStatus("idle")} 
                className="block w-full bg-green-500 text-black font-black uppercase py-2.5 hover:bg-green-400 transition-colors border-2 border-black min-h-[44px] text-xs"
              >
                Compose Another Message
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-2">
                <MessageSquare size={16} />
                <span className="font-black uppercase text-xs">Send Feedback or Inquiry</span>
              </div>
              <div>
                <label className="block font-black uppercase text-xs mb-1">Your Full Name</label>
                <input 
                  required 
                  type="text" 
                  minLength={2}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-4 border-black p-2.5 text-sm focus:bg-yellow-50 outline-none" 
                  placeholder="e.g. Jane Smith" 
                />
              </div>
              <div>
                <label className="block font-black uppercase text-xs mb-1">Your Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-4 border-black p-2.5 text-sm focus:bg-yellow-50 outline-none" 
                  placeholder="jane@example.com" 
                />
              </div>
              <div>
                <label className="block font-black uppercase text-xs mb-1">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border-4 border-black p-2.5 text-sm focus:bg-yellow-50 outline-none" 
                  placeholder="e.g. Tool suggestion / Question" 
                />
              </div>
              <div>
                <label className="block font-black uppercase text-xs mb-1">Message / Tool Feedback</label>
                <textarea 
                  required 
                  minLength={10}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border-4 border-black p-2.5 text-sm focus:bg-yellow-50 outline-none h-28" 
                  placeholder="Describe your inquiry, feedback, or suggestion..."
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-black text-white font-black uppercase py-3 hover:bg-yellow-400 hover:text-black transition-colors text-xs sm:text-sm min-h-[44px] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Open in Email App
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
