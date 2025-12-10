/**
 * Scraper Adapters - Re-export from single entry point
 */

export { BaseScraper } from './BaseScraper.js';
export { JumiaScraper, jumiaScraper } from './JumiaScraper.js';

import { JumiaScraper } from './JumiaScraper.js';
import { MARKETPLACES } from '../../config/scraper.js';

/**
 * Get scraper adapter by marketplace name
 * @param {string} marketplace - Marketplace name ('jumia', 'amazon', etc.)
 * @returns {BaseScraper} - Scraper adapter instance
 */
export const getScraperAdapter = (marketplace = 'jumia') => {
  switch (marketplace.toLowerCase()) {
  case MARKETPLACES.JUMIA:
  case 'jumia':
    return new JumiaScraper();
  default:
    throw new Error(`Unsupported marketplace: ${marketplace}`);
  }
};
