import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { of, throwError } from 'rxjs';
import { StoryService, Story } from '../../services/story.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let storyServiceSpy: jasmine.SpyObj<StoryService>;

  const mockStoryIds = Array.from({ length: 100 }, (_, i) => i + 1);
  const mockStories: Story[] = mockStoryIds.map((id) => ({
    id,
    title: `Story ${id}`,
    by: `user${id}`,
    time: Math.floor(Date.now() / 1000),
    score: id,
  }));

  beforeEach(() => {
    storyServiceSpy = jasmine.createSpyObj('StoryService', [
      'getTopStoryIds',
      'getNewStoryIds',
      'getStoriesByIds',
    ]);
    storyServiceSpy.getTopStoryIds.and.returnValue(of([]));
    storyServiceSpy.getStoriesByIds.and.returnValue(of([]));

    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: StoryService, useValue: storyServiceSpy }],
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set pageSize based on screen width', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);
    component['adjustPageSize']();
    expect(component.pageSize).toBe(18);
  });

  it('should load top stories on init', () => {
    storyServiceSpy.getTopStoryIds.and.returnValue(of(mockStoryIds));
    component.ngOnInit();
    expect(storyServiceSpy.getTopStoryIds).toHaveBeenCalled();
  });

  it('should fallback to empty array on story ID fetch error', () => {
    storyServiceSpy.getTopStoryIds.and.returnValue(
      throwError(() => new Error('fail')),
    );
    component.loadStoryIds('top');
    expect(component.loadingComplete).toBeTrue();
  });

  it('should trigger view mode change and reload stories', () => {
    spyOn(
      component as unknown as { updateStories: () => void },
      'updateStories',
    );
    component['viewMode'] = 'grid';
    component.setViewMode('list');
    expect(component.viewMode).toBe('list');
    expect(component['updateStories']).toHaveBeenCalled();
  });

  it('should load stories for the current page', fakeAsync(() => {
    component.storyIds = mockStoryIds;
    component.pageSize = 10;
    component.currentPage = 0;

    storyServiceSpy.getStoriesByIds.and.returnValue(
      of(mockStories.slice(0, 10)),
    );

    component['updateStories']();
    tick();

    component.stories$.subscribe((stories) => {
      expect(stories.length).toBe(10);
      expect(stories[0].title).toBe('Story 1');
    });
  }));

  it('should handle empty pageIds and skip fetch', () => {
    spyOn(console, 'warn');
    component.storyIds = [];
    component['updateStories']();
    expect(console.warn).toHaveBeenCalledWith(
      'No story IDs to load for this page.',
    );
  });

  it('should go to next page when available', () => {
    spyOn(
      component as unknown as { updateStories: () => void },
      'updateStories',
    );
    component.storyIds = mockStoryIds;
    component.pageSize = 10;
    component.currentPage = 0;

    component.nextPage();
    expect(component.currentPage).toBe(1);
    expect(component['updateStories']).toHaveBeenCalled();
  });

  it('should not go to next page when at the end', () => {
    spyOn(
      component as unknown as { updateStories: () => void },
      'updateStories',
    );
    component.storyIds = mockStoryIds;
    component.pageSize = 50;
    component.currentPage = 1;

    component.nextPage();
    expect(component.currentPage).toBe(1);
    expect(component['updateStories']).not.toHaveBeenCalled();
  });

  it('should go to previous page when possible', () => {
    spyOn(
      component as unknown as { updateStories: () => void },
      'updateStories',
    );
    component.currentPage = 2;
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should not go to previous page if already at 0', () => {
    spyOn(
      component as unknown as { updateStories: () => void },
      'updateStories',
    );
    component.currentPage = 0;
    component.prevPage();
    expect(component.currentPage).toBe(0);
  });

  it('should cancel ongoing request on updateStories()', () => {
    const sub = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['storySubscription'] = sub;

    component.storyIds = [1, 2, 3];
    storyServiceSpy.getStoriesByIds.and.returnValue(of([]));

    component['updateStories']();
    expect(sub.unsubscribe).toHaveBeenCalled();
  });

  it('should set pendingPageSizeUpdate when pageSize changes on resize', () => {
    component.pageSize = 24;
    spyOnProperty(window, 'innerWidth').and.returnValue(500);
    component.handleResponsiveView();
    expect(component.pendingPageSizeUpdate).toBeTrue();
  });

  it('should not set pendingPageSizeUpdate when size stays the same', () => {
    component.pageSize = 10;
    spyOnProperty(window, 'innerWidth').and.returnValue(500);
    component.handleResponsiveView();
    expect(component.pendingPageSizeUpdate).toBeFalse();
  });

  it('should switch to list view on small screens if not already list', () => {
    component.viewMode = 'grid';
    spyOn(component, 'setViewMode');
    spyOnProperty(window, 'innerWidth').and.returnValue(600);
    component.handleResponsiveView();
    expect(component.setViewMode).toHaveBeenCalledWith('list');
  });

  it('should apply pending page size update and recalculate current page', () => {
    component.pageSize = 24;
    component.currentPage = 2;
    component.pendingPageSizeUpdate = true;

    spyOn(
      component as unknown as { adjustPageSize: () => void },
      'adjustPageSize',
    ).and.callFake(() => {
      component.pageSize = 12;
    });

    component['applyPendingPageSizeUpdate']();
    expect(component.currentPage).toBe(4); // (2*24)/12
    expect(component.pendingPageSizeUpdate).toBeFalse();
  });
});
