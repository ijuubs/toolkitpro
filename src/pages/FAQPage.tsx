import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';

const FAQS = [
  {
    q: "Are the tools really free?",
    a: "Yes. All tools on ToolKitPro are 100% free for personal and commercial use. We believe that basic digital utilities should be as accessible as public infrastructure. We monetize via unobtrusive advertisements and sponsorships, allowing us to keep the servers running without ever charging our users."
  },
  {
    q: "Is my data safe with ToolKitPro?",
    a: "Absolutely. We are pioneers of 'Client-Side Sovereignty.' Most of our tools use WebAssembly and local JavaScript, meaning your files and data never leave your browser sandbox. For the rare tools that might require minimal server-side computing, we use end-to-end encrypted streams and our memory-resident buffers are purged immediately after the session ends."
  },
  {
    q: "What is the 'Privacy Architecture' mentioned on the home page?",
    a: "The Privacy Architecture refers to our choice to avoid backend databases for user data. Instead of storing your documents and text on our disks, we load our processing libraries into your device's RAM. This eliminates the 'central point of failure' typical of standard tool sites; if our servers were ever breached, your data wouldn't be there to steal because it never left your computer."
  },
  {
    q: "Do I need to create an account?",
    a: "Never. Account-based systems are often used by free sites as a way to harvest your email for marketing. We believe in high-performance access without friction. No sign-ups, no tracking accounts, no cookies that follow you across the web."
  },
  {
    q: "How accurate are the results?",
    a: "We use industrial-grade algorithms for all calculations. Our BMI calculator follows strict World Health Organization (WHO) benchmarks, our image resizer uses Lanczos resampling for pixel accuracy, and our unit converter relies on IEEE standard precision floats. However, for critical legal, medical, or financial decisions, we always recommend verifying with a human professional."
  },
  {
    q: "Can I use the tools offline?",
    a: "Yes! Because the tools run on Client-Side JavaScript, once you have loaded the tool page, it will continue to function even if you disconnect from the internet. This makes ToolKitPro the perfect companion for travel or low-connectivity environments."
  }
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <Helmet>
        <title>FAQ | ToolKitPro</title>
        <meta name="description" content="Frequently Asked Questions about ToolKitPro's privacy, tools, and mission." />
        <link rel="canonical" href={`${SITE_URL}/faq`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "name": "FAQ - ToolKitPro",
            "url": `${SITE_URL}/faq`,
            "mainEntity": FAQS.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })}
        </script>
      </Helmet>
      
      <h1 className="text-5xl font-black uppercase tracking-tighter border-b-8 border-black pb-4">Frequently Asked Questions</h1>
      
      <div className="space-y-8">
        {FAQS.map((faq, i) => (
          <div key={i} className="border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <h3 className="text-2xl font-black uppercase italic border-b-2 border-yellow-400 pb-2">{faq.q}</h3>
            <p className="text-xl font-medium text-[var(--muted)] leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
