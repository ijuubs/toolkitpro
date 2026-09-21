import { TOOLS } from './src/data/toolsData';

function checkOrphans() {
  const tools = TOOLS.map(t => t.slug);
  const reached = new Set<string>();

  // Homepage links (Category Page links + Tools linked directly)
  // Just a simple heuristic check
  
  console.log(`Total tools: ${tools.length}`);
  
  // Tools linked in related tools or category pages...
  // This is a manual check based on the code structure
  
  return tools.length;
}

checkOrphans();
