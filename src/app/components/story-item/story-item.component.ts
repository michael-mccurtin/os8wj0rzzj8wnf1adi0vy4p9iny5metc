import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { trigger, transition, style, animate } from '@angular/animations';
import {
  getTimeAgo,
  getStoryLink,
  extractDomain,
} from '../../utils/story-utils';
import { Story } from '../../services/story.service';

/**
 * Displays a single story card with metadata like title, author, score, and domain.
 * Renders differently based on the current view mode ('grid' or 'list').
 */
@Component({
  selector: 'app-story-item',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './story-item.component.html',
  styleUrls: ['./story-item.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'none' })),
      ]),
    ]),
  ],
})
export class StoryItemComponent implements OnChanges {
  @Input() story: Story | undefined;
  @Input() view: 'grid' | 'list' = 'grid';

  validStory = false;

  domain = '';
  storyLink = '';
  timeAgo = '';

  /**
   * Lifecycle hook to respond to input changes.
   */
  ngOnChanges(_changes: SimpleChanges): void {
    this.validateStory();
    this.validateViewMode();
    this.populateDerivedValues();
  }

  /**
   * Check if the input story is a valid object.
   */
  private validateStory(): void {
    this.validStory = !!this.story && typeof this.story === 'object';
  }

  /**
   * Fallback to 'grid' mode if the view input is invalid.
   */
  private validateViewMode(): void {
    const validViews: ('grid' | 'list')[] = ['grid', 'list'];
    if (!validViews.includes(this.view)) {
      console.warn(
        `Invalid view mode '${this.view}' passed to StoryItemComponent`,
      );
      this.view = 'grid';
    }
  }

  /**
   * Extracts and caches computed display values for the template.
   */
  private populateDerivedValues(): void {
    if (this.validStory && this.story) {
      this.domain = extractDomain(this.story);
      this.storyLink = getStoryLink(this.story);
      this.timeAgo = getTimeAgo(this.story.time);
    } else {
      this.domain = '';
      this.storyLink = '#';
      this.timeAgo = '';
    }
  }
}
