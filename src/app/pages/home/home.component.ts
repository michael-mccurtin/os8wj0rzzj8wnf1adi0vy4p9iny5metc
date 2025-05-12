import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, Subscription } from 'rxjs';

import { Story, StoryService } from '../../services/story.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoryListComponent } from '../../components/story-list/story-list.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { PaginationBarComponent } from '../../components/pagination-bar/pagination-bar.component';

/**
 * The main page component that displays a list of Hacker News stories.
 * Handles fetching story IDs, pagination logic, and view mode switching.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    StoryListComponent,
    NavbarComponent,
    PaginationBarComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  stories$!: Observable<Story[]>;
  storyIds: number[] = [];

  currentPage = 0;
  pageSize = 50;
  storyType: 'top' | 'new' = 'top';
  viewMode: 'grid' | 'list' = 'list';
  pendingPageSizeUpdate = false;

  isLoading = false;
  loadingComplete = false;

  private storySubscription?: Subscription;

  constructor(private storyService: StoryService) {}

  ngOnInit(): void {
    this.adjustPageSize();
    this.loadStoryIds(this.storyType);
    this.handleResponsiveView();

    window.addEventListener('resize', this.handleResponsiveView);
  }

  ngOnDestroy(): void {
    this.cancelOngoingRequest();
    window.removeEventListener('resize', this.handleResponsiveView);
  }

  /**
   * Adjusts the page size dynamically based on screen width.
   */
  private adjustPageSize(): void {
    const width = window.innerWidth;
    const pageSizes: [number, number][] = [
      [2560, 50],
      [1920, 36],
      [1440, 30],
      [1200, 24],
      [1024, 18],
      [768, 12],
    ];
    const match = pageSizes.find(([minWidth]) => width >= minWidth);
    this.pageSize = match ? match[1] : 10;
  }

  /**
   * Updates the view mode between grid and list.
   */
  setViewMode(mode: 'grid' | 'list'): void {
    if (mode !== 'grid' && mode !== 'list') {
      console.warn('Invalid view mode selected:', mode);
      return;
    }

    if (this.viewMode !== mode) {
      this.viewMode = mode;
      this.updateStories();
    }
  }

  /**
   * Loads top or new story IDs based on the selected type.
   */
  loadStoryIds(type: 'top' | 'new'): void {
    if (type !== 'top' && type !== 'new') {
      console.warn('Invalid story type:', type);
      return;
    }

    this.storyType = type;

    const storyIds$ =
      type === 'top'
        ? this.storyService.getTopStoryIds()
        : this.storyService.getNewStoryIds();

    storyIds$.subscribe({
      next: (ids) => {
        if (!Array.isArray(ids)) {
          throw new Error('Story ID response is not an array');
        }
        this.storyIds = ids;
        this.currentPage = 0;
        this.updateStories();
      },
      error: (err) => {
        console.error(`Failed to load ${type} story IDs:`, err);
        this.storyIds = [];
        this.stories$ = of([]);
        this.loadingComplete = true;
      },
    });
  }

  /**
   * Updates the current page of stories based on selected page size and story IDs.
   */
  protected updateStories(): void {
    this.cancelOngoingRequest();
    this.isLoading = true;
    this.loadingComplete = false;

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.warn('Scroll failed:', err);
    }

    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const pageIds = this.storyIds.slice(start, end);

    if (!pageIds.length) {
      console.warn('No story IDs to load for this page.');
      this.stories$ = of([]);
      this.isLoading = false;
      this.loadingComplete = true;
      return;
    }

    this.stories$ = of([]); // Clear to reset animation

    this.storySubscription = this.storyService
      .getStoriesByIds(pageIds)
      .subscribe({
        next: (stories) => {
          setTimeout(() => {
            this.stories$ = of(Array.isArray(stories) ? stories : []);
            this.isLoading = false;
            this.loadingComplete = true;
          }, 0);
        },
        error: (err) => {
          console.error('Error fetching stories by ID:', err);
          this.stories$ = of([]);
          this.isLoading = false;
          this.loadingComplete = true;
        },
      });
  }

  /**
   * Move to the next page if not at the end.
   */
  nextPage(): void {
    this.applyPendingPageSizeUpdate();
    if ((this.currentPage + 1) * this.pageSize < this.storyIds.length) {
      this.currentPage++;
      this.updateStories();
    }
  }

  /**
   * Move to the previous page if not on the first.
   */
  prevPage(): void {
    this.applyPendingPageSizeUpdate();
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateStories();
    }
  }

  /**
   * Reset pagination to the first page.
   */
  goToStart(): void {
    this.applyPendingPageSizeUpdate();
    if (this.currentPage > 0) {
      this.currentPage = 0;
      this.updateStories();
    }
  }

  /**
   * Unsubscribes from the current story fetch request.
   */
  private cancelOngoingRequest(): void {
    this.storySubscription?.unsubscribe();
    this.storySubscription = undefined;
  }

  /**
   * Handles window resize to adjust page size and view mode responsively.
   */
  handleResponsiveView = (): void => {
    const prevPageSize = this.pageSize;
    this.adjustPageSize();

    if (window.innerWidth < 700 && this.viewMode !== 'list') {
      this.setViewMode('list');
    }

    if (this.pageSize !== prevPageSize) {
      this.pendingPageSizeUpdate = true;
    }
  };

  /**
   * Recalculates current page if the page size changed since last load.
   */
  private applyPendingPageSizeUpdate(): void {
    if (this.pendingPageSizeUpdate) {
      const oldStart = this.currentPage * this.pageSize;
      this.adjustPageSize();
      this.currentPage = Math.floor(oldStart / this.pageSize);
      this.pendingPageSizeUpdate = false;
    }
  }
}
