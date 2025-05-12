import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { StoryService, Story } from './story.service';

describe('StoryService', () => {
  let service: StoryService;
  let httpMock: HttpTestingController;

  // Mock story generator
  const createMockStory = (id: number): Story => ({
    id,
    title: `Story ${id}`,
    by: `user${id}`,
    time: Math.floor(Date.now() / 1000),
    score: 100,
    url: `https://example.com/story/${id}`,
    type: 'story',
    descendants: 101,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    service = TestBed.inject(StoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifies no unmatched requests were made
    httpMock.verify();
  });

  // Should fetch an array of top story IDs
  it('should fetch top story IDs', () => {
    const mockIds = [1, 2, 3];

    service.getTopStoryIds().subscribe((ids) => {
      expect(ids).toEqual(mockIds);
    });

    const req = httpMock.expectOne(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockIds);
  });

  // Should return empty array on error when fetching top story IDs
  it('should return empty array on top story IDs error', () => {
    service.getTopStoryIds().subscribe((ids) => {
      expect(ids).toEqual([]);
    });

    const req = httpMock.expectOne(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
    );
    req.error(new ErrorEvent('Network error'));
  });

  // Should fetch an individual story
  it('should fetch individual story', () => {
    const mockStory = createMockStory(123);

    service.getStory(123).subscribe((story) => {
      expect(story).toEqual(mockStory);
    });

    const req = httpMock.expectOne(
      'https://hacker-news.firebaseio.com/v0/item/123.json',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockStory);
  });

  // Should return null on fetch error for individual story
  it('should return null on story fetch error', () => {
    service.getStory(456).subscribe((story) => {
      expect(story).toBeNull();
    });

    const req = httpMock.expectOne(
      'https://hacker-news.firebaseio.com/v0/item/456.json',
    );
    req.error(new ProgressEvent('error'));
  });
});
