import { Tool, TOOLS } from '../data/toolsData';

const STORAGE_KEY = 'toolkitpro_recent_tools';
const MAX_RECENT = 8;

/**
 * Safely access localStorage to avoid errors in environments where it might be unavailable
 */
const getStorage = () => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch (e) {
    return null;
  }
};

/**
 * Retrieves the list of recently used tools from localStorage
 */
export function getRecentTools(): Tool[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const stored = storage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const ids: string[] = JSON.parse(stored);
    if (!Array.isArray(ids)) return [];

    // Map IDs to actual tool objects, filtering out any that no longer exist
    return ids
      .map(id => TOOLS.find(t => t.id === id))
      .filter((t): t is Tool => !!t)
      .slice(0, MAX_RECENT);
  } catch (e) {
    console.error('Error reading recent tools from storage', e);
    return [];
  }
}

/**
 * Adds a tool to the recently used list in localStorage
 */
export function addRecentTool(toolId: string): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    const stored = storage.getItem(STORAGE_KEY);
    let ids: string[] = stored ? JSON.parse(stored) : [];
    
    if (!Array.isArray(ids)) ids = [];

    // Remove the tool if it's already in the list to avoid duplicates
    ids = ids.filter(id => id !== toolId);

    // Add to the beginning (newest first)
    ids.unshift(toolId);

    // Keep only the last MAX_RECENT entries
    ids = ids.slice(0, MAX_RECENT);

    storage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Error saving recent tool to storage', e);
  }
}
