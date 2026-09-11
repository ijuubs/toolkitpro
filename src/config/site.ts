// Central site configuration for SEO, sitemaps, and canonical tags
const getSiteUrl = () => {
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '' && !envUrl.includes('utility-tools-eta')) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'https://toolkitpro-e5y5.vercel.app';
};

export const SITE_URL = getSiteUrl();

export const SITE_NAME = 'ToolKitPro';
export const SITE_DESCRIPTION = 'High-performance browser-side utility tools. 100% private, client-side, zero log-in.';
