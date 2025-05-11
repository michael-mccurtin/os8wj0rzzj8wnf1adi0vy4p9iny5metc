import { getTimeAgo, getStoryLink, extractDomain } from './story-utils';
import { Story } from '../services/story.service';

describe('Story Utils', () => {
  describe('getTimeAgo', () => {
    const now = Math.floor(Date.now() / 1000);

    it('should return "just now" if time is less than 5 seconds ago', () => {
      expect(getTimeAgo(now)).toBe('just now');
      expect(getTimeAgo(now - 3)).toBe('just now');
    });

    it('should return seconds ago', () => {
      expect(getTimeAgo(now - 10)).toBe('10s ago');
    });

    it('should return minutes ago', () => {
      expect(getTimeAgo(now - 120)).toBe('2m ago');
    });

    it('should return hours ago', () => {
      expect(getTimeAgo(now - 3600)).toBe('1h ago');
    });

    it('should return days ago', () => {
      expect(getTimeAgo(now - 172800)).toBe('2d ago');
    });

    it('should never return negative time', () => {
      expect(getTimeAgo(now + 100)).toBe('just now');
    });
  });

  describe('getStoryLink', () => {
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

    it('should return fallback link "#" on invalid input', () => {
      const invalidInput = null as unknown as Story;
      expect(getStoryLink(invalidInput)).toBe('#');
    });
  });

  describe('extractDomain', () => {
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
