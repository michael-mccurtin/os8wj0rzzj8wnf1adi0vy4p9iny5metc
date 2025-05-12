import { getTimeAgo, getStoryLink, extractDomain } from './story-utils';
import { Story } from '../services/story.service';

describe('Story Utils', () => {
  
  describe('getTimeAgo', () => {
    
    let now:number = Date.now();

    beforeEach(() => {
      now = Math.floor(Date.now() / 1000);
    });

    // Should return "just now" if the event was within the last 5 seconds
    it('should return "just now" if time is less than 5 seconds ago', () => {
      expect(getTimeAgo(now)).toBe('just now');
      expect(getTimeAgo(now - 3)).toBe('just now');
    });

    // Should return time in seconds with leniency for real-time drift
    it('should return seconds ago', () => {
      const output = getTimeAgo(now - 10);
      const expected = ['9s ago', '10s ago', '11s ago']; // allow for timing variance
      expect(expected).toContain(output);
    });

    // Should return formatted time in minutes
    it('should return minutes ago', () => {
      expect(getTimeAgo(now - 120)).toBe('2m ago');
    });

    // Should return formatted time in hours
    it('should return hours ago', () => {
      expect(getTimeAgo(now - 3600)).toBe('1h ago');
    });

    // Should return formatted time in days
    it('should return days ago', () => {
      expect(getTimeAgo(now - 172800)).toBe('2d ago');
    });

    // Should not return future time (e.g. if clock skew occurs)
    it('should never return negative time', () => {
      expect(getTimeAgo(now + 100)).toBe('just now');
    });
  });

  describe('getStoryLink', () => {
    // Should return original URL when present
    it('should return story URL if present', () => {
      const story: Story = {
        id: 123,
        title: '',
        by: '',
        time: 0,
        score: 0,
        url: 'https://rte.ie',
      };
      expect(getStoryLink(story)).toBe('https://rte.ie');
    });

    // Should fallback to Hacker News item link if no URL
    it('should return HN fallback if no URL', () => {
      const story: Story = {
        id: 456,
        title: '',
        by: '',
        time: 0,
        score: 0,
      };
      expect(getStoryLink(story)).toBe(
        'https://news.ycombinator.com/item?id=456',
      );
    });

    // Should return "#" if input is null or invalid
    it('should return fallback link "#" on invalid input', () => {
      const invalidInput = null as unknown as Story;
      expect(getStoryLink(invalidInput)).toBe('#');
    });
  });

  describe('extractDomain', () => {
    // Should return clean domain from full URL
    it('should return domain from a URL', () => {
      const story: Story = {
        id: 1,
        title: '',
        by: '',
        time: 0,
        score: 0,
        url: 'https://www.example.com/article/123',
      };
      expect(extractDomain(story)).toBe('example.com');
    });

    // Should default to Hacker News when URL is absent
    it('should fallback to HN if no url is provided', () => {
      const story: Story = {
        id: 2,
        title: '',
        by: '',
        time: 0,
        score: 0,
      };
      expect(extractDomain(story)).toBe('news.ycombinator.com');
    });

    // Should fallback on malformed/invalid URL
    it('should return fallback domain on invalid URL', () => {
      const story: Story = {
        id: 3,
        title: '',
        by: '',
        time: 0,
        score: 0,
        url: '%%%not-a-url%%%',
      };
      expect(extractDomain(story)).toBe('news.ycombinator.com');
    });
  });
});
