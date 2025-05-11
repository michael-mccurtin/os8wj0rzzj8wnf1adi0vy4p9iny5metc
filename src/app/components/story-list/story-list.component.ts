import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryItemComponent } from '../story-item/story-item.component';
import { Story } from '../../services/story.service';

/**
 * Displays a list of stories in either 'grid' or 'list' layout mode.
 * Filters out invalid stories and handles fallback rendering.
 */
@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [CommonModule, StoryItemComponent],
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
})
export class StoryListComponent implements OnChanges {
  @Input() stories: Story[] | null = null;
  @Input() view: 'grid' | 'list' = 'grid';

  safeStories: Story[] = [];
  isValidView = true;
  skeletonItems = Array.from({ length: 10 });

  /**
   * Tracks items in *ngFor to optimize re-rendering.
   */
  trackById(index: number, story: Story): number {
    return story.id;
  }

  /**
   * Validate and sanitize incoming @Input bindings.
   */
  ngOnChanges(_changes: SimpleChanges): void {
    this.validateStories();
    this.validateViewMode();
  }

  /**
   * Validates the stories input, ensuring it's an array of objects.
   */
  private validateStories(): void {
    if (!Array.isArray(this.stories)) {
      console.warn(
        'Invalid or missing stories input in StoryListComponent:',
        this.stories,
      );
      this.safeStories = [];
    } else {
      // Filter out null, undefined, or non-object entries
      this.safeStories = this.stories.filter(
        (story): story is Story => story && typeof story === 'object',
      );
    }
  }

  /**
   * Ensures the view mode is either 'grid' or 'list'.
   */
  private validateViewMode(): void {
    const validModes: ('grid' | 'list')[] = ['grid', 'list'];

    if (!validModes.includes(this.view)) {
      console.warn(`Invalid view mode '${this.view}' in StoryListComponent`);
      this.view = 'grid'; // fallback
      this.isValidView = false;
    } else {
      this.isValidView = true;
    }
  }
}
