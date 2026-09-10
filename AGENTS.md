# ToolKitPro Project Guidelines

## Brand & Design: Neu-Brutalism
- **Colors:** Stark B&W base (`#F5F5F5` background, black text). Use high-contrast accents (e.g., `yellow-400`, `yellow-200`).
- **Typography:** Bold, black, uppercase for headings (`font-black uppercase`). High-legibility sans-serif for body.
- **Layout:** Hard edges, sharp corners, heavy solid borders (`border-4 border-black`).
- **Interaction:** Hard drop shadows (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`) which disappear on hover to create a physical "click" effect.
- **Components:** Avoid generic shadows and rounded borders. Prefer `border-black` and deliberate, high-contrast states.

## SEO Strategy (Programmatic SEO)
- **Architecture:** All tools must be managed via `/src/data/toolsData.ts`.
- **Routing:** Use dynamic routes (`/tools/:slug`) serviced by `ToolTemplate.tsx`.
- **Content:** Every tool must include rich `howTo` (1000+ word goal) and `faqs` in `toolsData.ts`.
- **Structured Data:** Every `ToolTemplate` page MUST inject `WebApplication` Schema.org JSON-LD.
- **Meta:** Use `react-helmet-async` for unique `<title>` and `<description>` per tool.

## Monetization (Google AdSense)
- **AdSense:** ALL AdSense slots MUST use the `AdSlot` component to enforce `min-height` and prevent Cumulative Layout Shift (CLS). Only Google AdSense is used for monetization.
- **Placement:** Ads must be outside the primary interaction flow. The Tool UI must always be the first thing visible. Integrate ads within/under SEO content.

## Performance
- **Bundling:** Use `React.lazy()` and `Suspense` for all tool components in `/src/pages/ToolTemplate.tsx`.
- **Optimization:** Keep bundle sizes low.
