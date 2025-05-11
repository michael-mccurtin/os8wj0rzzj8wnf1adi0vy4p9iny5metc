import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryItemComponent } from './story-item.component';
import { Story } from '../../services/story.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StoryItemComponent', () => {
  let component: StoryItemComponent;
  let fixture: ComponentFixture<StoryItemComponent>;

  // Sample mock story with valid properties
  const mockStory: Story = {
    id: 123,
    title: 'Sample Story',
    url: 'https://example.com/story',
    by: 'test_user',
    score: 100,
    descendants: 6,
    time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      // import NoopAnimationsModule to disable StoryItem @fadeIn animations
      imports: [StoryItemComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(StoryItemComponent);
    component = fixture.componentInstance;
  });

  // Should accept a valid story and precompute fields
  it('should validate a proper story input', () => {
    component.story = mockStory;
    component.ngOnChanges({});
    expect(component.validStory).toBeTrue();
    expect(component.domain).toBe('example.com');
    expect(component.storyLink).toContain('https://example.com');
    expect(component.timeAgo).toContain('ago');
  });

  // Should handle null story input gracefully
  it('should invalidate a null story and clear computed fields', () => {
    component.story = null as unknown as Story;
    component.ngOnChanges({});
    expect(component.validStory).toBeFalse();
    expect(component.domain).toBe('');
    expect(component.storyLink).toBe('#');
    expect(component.timeAgo).toBe('');
  });

  // Should render the correct number of comments from descendants array
  it('should render the correct number of comments from descendants', () => {
    component.story = mockStory;
    component.view = 'list';
    component.ngOnChanges({});
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const subtitle = compiled.querySelector('mat-card-subtitle')?.textContent;

    expect(subtitle).toContain('6 comments');
  });
});
