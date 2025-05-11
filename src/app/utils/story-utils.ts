import { Story } from '../services/story.service';

/**
 * Utility functions for formatting and extracting metadata from Hacker News stories.
 *
 * Includes:
 * - `getTimeAgo`: Converts a UNIX timestamp into a human-readable "time ago" format.
 * - `getStoryLink`: Returns the original story URL if present, otherwise fallback to Hacker News.
 * - `extractDomain`: Extracts the domain name from a given story's URL, with fallback handling.
 */

/**
 * Converts a Unix timestamp to a relative "time ago" string.
 * Safely handles invalid or future timestamps.
 */
export function getTimeAgo(unixTime: number): string {
  if (!Number.isFinite(unixTime) || unixTime <= 0) return 'unknown';

  const now = Math.floor(Date.now() / 1000);
  const seconds = Math.max(0, now - unixTime); // Clamp to prevent negative values

  if (seconds < 5) return 'just now';

  const timeUnits: [string, number][] = [
    ['d', 86400],
    ['h', 3600],
    ['m', 60],
    ['s', 1],
  ];

  for (const [unit, unitSeconds] of timeUnits) {
    if (seconds >= unitSeconds) {
      const value = Math.floor(seconds / unitSeconds);
      return `${value}${unit} ago`;
    }
  }

  return 'just now'; // Fallback
}

/**
 * Returns the link to the story's original URL, or a fallback to its HN page.
 */
export function getStoryLink(story: Story): string {
  if (!story || typeof story !== 'object') return '#';
  return story.url || `https://news.ycombinator.com/item?id=${story.id || ''}`;
}

/**
 * Extracts the domain name from a story URL.
 */
export function extractDomain(story: Story): string {
  const url = story?.url;
  if (!url || typeof url !== 'string') return 'news.ycombinator.com';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (err) {
    console.error('Failed to parse domain from URL:', url, err);
    return 'news.ycombinator.com';
  }
}
