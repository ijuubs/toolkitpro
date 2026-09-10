import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '../config/site';

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <Helmet>
        <title>Disclaimer | ToolKitPro</title>
        <meta name="description" content="Important disclaimer regarding the use of utility tools and calculators on ToolKitPro." />
        <link rel="canonical" href={`${SITE_URL}/disclaimer`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Disclaimer - ToolKitPro",
            "url": `${SITE_URL}/disclaimer`,
            "description": "Important disclaimer regarding the use of utility tools and calculators on ToolKitPro."
          })}
        </script>
      </Helmet>
      
      <h1 className="text-5xl font-black uppercase tracking-tighter border-b-8 border-black pb-4">Disclaimer</h1>
      
      <div className="prose prose-lg max-w-none text-[var(--muted)] space-y-6">
        <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at support@toolkitpro.io.</p>

        <h2 className="text-2xl font-black text-black uppercase">Disclaimers for ToolKitPro</h2>
        <p>All the information on this website - toolkitpro.io - is published in good faith and for general information purpose only. ToolKitPro does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (ToolKitPro), is strictly at your own risk. ToolKitPro will not be liable for any losses and/or damages in connection with the use of our website.</p>

        <h2 className="text-2xl font-black text-black uppercase">External Links Disclaimer</h2>
        <p>From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.</p>

        <h3 className="text-xl font-bold text-black uppercase">Consent</h3>
        <p>By using our website, you hereby consent to our disclaimer and agree to its terms.</p>

        <h3 className="text-xl font-bold text-black uppercase">Update</h3>
        <p>Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p>
      </div>
    </div>
  );
}
