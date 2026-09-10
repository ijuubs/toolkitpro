// Central site configuration for SEO, sitemaps, and canonical tags
export const SITE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL)
  ? import.meta.env.VITE_SITE_URL.replace(/\/$/, '')
  : 'https://utility-tools-eta.vercel.app';

export const SITE_NAME = 'ToolKitPro';
export const SITE_DESCRIPTION = 'High-performance browser-side utility tools. 100% private, client-side, zero log-in.';
