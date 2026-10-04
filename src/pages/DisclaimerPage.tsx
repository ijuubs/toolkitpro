import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from '../config/site';
import Breadcrumbs from '../components/Breadcrumbs';

export default function DisclaimerPage() {
  const canonicalUrl = `${SITE_URL}/disclaimer`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      <Helmet>
        <title>Disclaimer | {SITE_NAME}</title>
        <meta name="description" content={`Important legal, financial, tax, and health disclaimer regarding the use of utility tools and calculators on ${SITE_NAME}.`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`Disclaimer | ${SITE_NAME}`} />
        <meta property="og:description" content={`Important legal, financial, tax, and health disclaimer regarding the use of utility tools and calculators on ${SITE_NAME}.`} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `Disclaimer - ${SITE_NAME}`,
            "url": canonicalUrl,
            "description": `Important disclaimer regarding the use of utility tools and calculators on ${SITE_NAME}.`
          })}
        </script>
      </Helmet>
      
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Disclaimer' }]} />

      <div className="border-b-4 sm:border-b-8 border-black pb-3 sm:pb-4">
        <span className="bg-black text-white text-xs font-black uppercase px-2.5 py-1 tracking-wider inline-block mb-2">
          Legal & Educational Notice
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
          Disclaimer
        </h1>
        <p className="font-bold text-xs sm:text-sm text-neutral-600 mt-2">
          Last updated: October 4, 2026 • Please read this disclaimer carefully before relying on calculations, tools, or guides on {SITE_NAME}.
        </p>
      </div>
      
      <div className="prose prose-lg max-w-none text-neutral-800 space-y-6 text-sm sm:text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            1. General Information Only
          </h2>
          <p>
            All information, tools, converters, and calculators on this website—<a href={SITE_URL} className="underline font-bold text-black">{SITE_URL}</a>—are published in good faith and for general informational and educational purposes only. {SITE_NAME} makes no representations or warranties of any kind, express or implied, regarding the completeness, accuracy, reliability, suitability, or availability of the results generated. Any reliance you place on such information is strictly at your own risk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            2. Financial, Tax & Legal Calculators
          </h2>
          <p>
            Our financial calculators (including loan amortization, compound interest, ROI, SIP) and specialized Fiji utilities (such as Fiji PAYE Salary, VAT, FNPF, TSLS, Import Duty, Vehicle Running Costs, and Taxi Meter Fares) provide mathematical simulations based on publicly available formulas and statutory rates.
          </p>
          <p>
            In the Republic of Fiji, tax laws, fiscal tariffs, and statutory contribution schedules administered by the <strong>Fiji Revenue and Customs Service (FRCS)</strong>, <strong>Fiji National Provident Fund (FNPF)</strong>, <strong>Fijian Competition and Consumer Commission (FCCC)</strong>, and government ministries are subject to legislative change, annual budget amendments, and individual circumstances. These tools do not constitute financial, accounting, investment, tax, or legal advice. Always consult a registered tax agent, certified accountant, financial planner, or the relevant government body for official assessments.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            3. Health & Fitness Calculators
          </h2>
          <p>
            Calculators relating to health, body metrics, and nutrition (such as our BMI Calculator and TDEE Calculator) are based on general population formulas (e.g., WHO BMI classifications, Mifflin-St Jeor equation). They are designed for general wellness estimation and do <strong>not</strong> constitute medical advice, clinical diagnosis, or treatment plans. Body Mass Index and caloric expenditure vary widely based on muscle density, age, pregnancy, and medical conditions. Always consult a qualified physician or healthcare professional before making significant dietary, weight-loss, or exercise changes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            4. Third-Party Advertising & External Links
          </h2>
          <p>
            {SITE_NAME} displays third-party advertisements served by Google AdSense to fund site operation and maintenance. The presence of an advertisement or an external link on this website does not imply an endorsement or recommendation of the advertised product, service, or external site. We have no control over the content, claims, or practices of third-party advertisers or external websites. For details on how advertising partners use cookies, please review our <Link to="/privacy" className="underline font-bold text-black">Privacy Policy</Link>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-black uppercase pt-2">
            5. Contact Information
          </h2>
          <p>
            If you have any questions or require further clarification regarding this disclaimer, please contact us by email at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-bold text-black">{CONTACT_EMAIL}</a> or visit our{' '}
            <Link to="/contact" className="underline font-bold text-black">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
