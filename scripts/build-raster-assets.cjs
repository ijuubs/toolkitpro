const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

// 1. Generate 512x512 Toolbox Icon SVG
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Vignette / dark backdrop for icon -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2a2a2e"/>
      <stop offset="60%" stop-color="#141416"/>
      <stop offset="100%" stop-color="#000000"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="64" fill="url(#vignette)"/>

  <!-- Dynamic Yellow Speed Lines -->
  <g fill="#FACC15" opacity="0.95">
    <!-- Top-left stripe -->
    <polygon points="0,200 95,160 70,185 0,225"/>
    <!-- Bottom-left stripe -->
    <polygon points="0,380 90,345 65,370 0,405"/>
    <!-- Top-right stripe -->
    <polygon points="405,80 512,35 512,65 425,105"/>
    <!-- Bottom-right stripe -->
    <polygon points="415,350 512,305 512,335 435,375"/>
  </g>

  <!-- 3D Isometric Toolbox Group -->
  <g filter="url(#shadow)" transform="translate(10, 0)">
    <!-- Yellow Handle -->
    <path d="M 180 160 C 180 75, 340 75, 340 160" fill="none" stroke="#000000" stroke-width="44" stroke-linecap="round"/>
    <path d="M 180 160 C 180 75, 340 75, 340 160" fill="none" stroke="#FACC15" stroke-width="26" stroke-linecap="round"/>

    <!-- Toolbox Solid Black Outline Base -->
    <polygon points="90,220 185,125 395,125 480,205 480,380 385,460 185,460 90,380" fill="#000000"/>

    <!-- Toolbox White Lid Panel -->
    <polygon points="95,215 185,130 390,130 300,215" fill="#FFFFFF" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>
    <!-- Lid Right Bevel (Yellow/Gold) -->
    <polygon points="390,130 475,205 385,215 300,215" fill="#EAB308" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>

    <!-- Front Left Face (White) with Gear Cutout Notch -->
    <polygon points="95,225 295,225 295,270 230,270 190,345 230,420 295,420 295,450 185,450 95,375" fill="#FFFFFF" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>

    <!-- Front Right Face (Yellow Side) -->
    <polygon points="300,225 475,215 475,375 385,450 300,450" fill="#FACC15" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>

    <!-- Center Latch (Yellow) -->
    <rect x="278" y="195" width="38" height="52" rx="8" fill="#FACC15" stroke="#000000" stroke-width="8"/>
    <rect x="286" y="210" width="22" height="22" rx="4" fill="#EAB308" stroke="#000000" stroke-width="4"/>

    <!-- Gear Mechanism (Yellow & Black) -->
    <g transform="translate(305, 345)">
      <!-- 8 Teeth -->
      <g fill="#FACC15" stroke="#000000" stroke-width="7" stroke-linejoin="round">
        <rect x="-14" y="-62" width="28" height="24" rx="4"/>
        <rect x="-14" y="38" width="28" height="24" rx="4"/>
        <rect x="-62" y="-14" width="24" height="28" rx="4"/>
        <rect x="38" y="-14" width="24" height="28" rx="4"/>
        <!-- Diagonal teeth -->
        <rect x="-48" y="-48" width="26" height="26" rx="4" transform="rotate(45 -35 -35)"/>
        <rect x="22" y="22" width="26" height="26" rx="4" transform="rotate(45 35 35)"/>
        <rect x="-48" y="22" width="26" height="26" rx="4" transform="rotate(-45 -35 35)"/>
        <rect x="22" y="-48" width="26" height="26" rx="4" transform="rotate(-45 35 -35)"/>
      </g>
      <!-- Outer Gear Wheel -->
      <circle cx="0" cy="0" r="50" fill="#FACC15" stroke="#000000" stroke-width="9"/>
      <!-- Inner Center Hole -->
      <circle cx="0" cy="0" r="22" fill="#000000"/>
    </g>
  </g>
</svg>
`;

// 2. Generate Horizontal Logo SVG (1200x280) with Text
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 280" width="1200" height="280">
  <!-- Solid Black Background -->
  <rect width="1200" height="280" fill="#000000"/>

  <!-- Left Toolbox Icon (Scale ~ 0.52) -->
  <g transform="translate(35, 10) scale(0.52)">
    <!-- Speed Lines -->
    <g fill="#FACC15">
      <polygon points="0,200 95,160 70,185 0,225"/>
      <polygon points="0,380 90,345 65,370 0,405"/>
      <polygon points="405,80 512,35 512,65 425,105"/>
      <polygon points="415,350 512,305 512,335 435,375"/>
    </g>

    <!-- Handle -->
    <path d="M 180 160 C 180 75, 340 75, 340 160" fill="none" stroke="#000000" stroke-width="44" stroke-linecap="round"/>
    <path d="M 180 160 C 180 75, 340 75, 340 160" fill="none" stroke="#FACC15" stroke-width="26" stroke-linecap="round"/>

    <!-- Toolbox Solid Black Outline Base -->
    <polygon points="90,220 185,125 395,125 480,205 480,380 385,460 185,460 90,380" fill="#000000"/>

    <!-- White Lid Panel -->
    <polygon points="95,215 185,130 390,130 300,215" fill="#FFFFFF" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>
    <!-- Lid Right Bevel (Yellow/Gold) -->
    <polygon points="390,130 475,205 385,215 300,215" fill="#EAB308" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>

    <!-- Front Left Face (White) with Gear Cutout Notch -->
    <polygon points="95,225 295,225 295,270 230,270 190,345 230,420 295,420 295,450 185,450 95,375" fill="#FFFFFF" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>

    <!-- Front Right Face (Yellow Side) -->
    <polygon points="300,225 475,215 475,375 385,450 300,450" fill="#FACC15" stroke="#000000" stroke-width="10" stroke-linejoin="round"/>

    <!-- Center Latch (Yellow) -->
    <rect x="278" y="195" width="38" height="52" rx="8" fill="#FACC15" stroke="#000000" stroke-width="8"/>
    <rect x="286" y="210" width="22" height="22" rx="4" fill="#EAB308" stroke="#000000" stroke-width="4"/>

    <!-- Gear Mechanism -->
    <g transform="translate(305, 345)">
      <g fill="#FACC15" stroke="#000000" stroke-width="7" stroke-linejoin="round">
        <rect x="-14" y="-62" width="28" height="24" rx="4"/>
        <rect x="-14" y="38" width="28" height="24" rx="4"/>
        <rect x="-62" y="-14" width="24" height="28" rx="4"/>
        <rect x="38" y="-14" width="24" height="28" rx="4"/>
        <rect x="-48" y="-48" width="26" height="26" rx="4" transform="rotate(45 -35 -35)"/>
        <rect x="22" y="22" width="26" height="26" rx="4" transform="rotate(45 35 35)"/>
        <rect x="-48" y="22" width="26" height="26" rx="4" transform="rotate(-45 -35 35)"/>
        <rect x="22" y="-48" width="26" height="26" rx="4" transform="rotate(-45 35 -35)"/>
      </g>
      <circle cx="0" cy="0" r="50" fill="#FACC15" stroke="#000000" stroke-width="9"/>
      <circle cx="0" cy="0" r="22" fill="#000000"/>
    </g>
  </g>

  <!-- Typography "ToolkitPro" -->
  <text x="340" y="180" font-family="'Liberation Sans', 'Inter', -apple-system, sans-serif" font-weight="900" font-size="142" letter-spacing="-3">
    <tspan fill="#FFFFFF">Toolkit</tspan><tspan fill="#FACC15">Pro</tspan>
  </text>
</svg>
`;

async function run() {
  console.log('Building raster brand assets with Sharp & ImageMagick...');

  // 1. toolkitpro-icon-512.png
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(__dirname, '../public/toolkitpro-icon-512.png'));
  console.log('Created public/toolkitpro-icon-512.png');

  // 2. toolkitpro-logo-web.png & toolkitpro-logo-web.webp
  await sharp(Buffer.from(logoSvg))
    .png({ quality: 100 })
    .toFile(path.join(__dirname, '../public/toolkitpro-logo-web.png'));
  console.log('Created public/toolkitpro-logo-web.png');

  await sharp(Buffer.from(logoSvg))
    .webp({ quality: 95, lossless: false })
    .toFile(path.join(__dirname, '../public/toolkitpro-logo-web.webp'));
  console.log('Created public/toolkitpro-logo-web.webp');

  // 3. Multi-resolution favicon frames for favicon.ico
  const tmpDir = path.join(__dirname, '../tmp-icons');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  for (const s of [16, 32, 48, 64]) {
    await sharp(Buffer.from(iconSvg))
      .resize(s, s)
      .png()
      .toFile(path.join(tmpDir, `icon-${s}.png`));
  }

  // Combine into standard multi-resolution Windows / Browser favicon.ico
  execSync(`convert ${tmpDir}/icon-16.png ${tmpDir}/icon-32.png ${tmpDir}/icon-48.png ${tmpDir}/icon-64.png public/favicon.ico`);
  console.log('Created public/favicon.ico');

  // Clean up tmp icons
  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log('All brand raster assets successfully built!');
}

run().catch(console.error);
