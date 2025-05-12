import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryListComponent } from './story-list.component';
import { Story } from '../../services/story.service';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;

  const mockStories: Story[] = [
    {
      id: 1,
      title: 'Story 1',
      by: 'user1',
      time: Math.floor(Date.now() / 1000),
      score: 100,
    },
    {
      id: 2,
      title: 'Story 2',
      by: 'user2',
      time: Math.floor(Date.now() / 1000),
      score: 200,
    },
    {
      id: 3,
      title: 'Story 3',
      by: 'user3',
      time: Math.floor(Date.now() / 1000),
      score: 300,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoryListComponent],
    });

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
  });

  it('should initialize with valid stories', () => {
    component.stories = mockStories;
    component.ngOnChanges({});
    expect(component.safeStories.length).toBe(3);
    expect(component.safeStories[0].title).toBe('Story 1');
  });

  it('should filter out invalid story objects', () => {
    const invalidStories = [
      null,
      {
        id: 1,
        title: 'Valid',
        by: 'user',
        time: Date.now(),
        score: 10,
      },
      'bad',
    ] as unknown as Story[];

    component.stories = invalidStories;
    component.ngOnChanges({});
    expect(component.safeStories.length).toBe(1);
    expect(component.safeStories[0].title).toBe('Valid');
  });

  it('should fallback to empty array on invalid stories input', () => {
    component.stories = null as unknown as Story[];
    component.ngOnChanges({});
    expect(component.safeStories).toEqual([]);
  });

  it('should accept valid view mode "list"', () => {
    component.stories = mockStories;
    component.view = 'list';
    component.ngOnChanges({});
    expect(component.view).toBe('list');
    expect(component.isValidView).toBeTrue();
  });

  it('should fallback to "grid" on invalid view mode', () => {
    component.stories = mockStories;
    component.view = 'table' as unknown as 'grid' | 'list';
    component.ngOnChanges({});
    expect(component.view).toBe('grid');
    expect(component.isValidView).toBeFalse();
  });

  it('should track stories by ID using trackById()', () => {
    const id = component.trackById(0, mockStories[0]);
    expect(id).toBe(1);
  });

  it('should initialize with 10 skeletonItems', () => {
    expect(component.skeletonItems.length).toBe(10);
  });
});
