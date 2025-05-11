import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

/**
 * Pagination bar component that displays page navigation controls.
 * Emits events for next/prev/start page changes based on available stories.
 */
@Component({
  selector: 'app-pagination-bar',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './pagination-bar.component.html',
  styleUrls: ['./pagination-bar.component.scss'],
})
export class PaginationBarComponent implements OnChanges {
  @Input() currentPage!: number;

  @Input() pageSize!: number;

  @Input() totalStories!: number;

  /**
   * Emits when user requests next page.
   */
  @Output() next = new EventEmitter<void>();

  /**
   * Emits when user requests previous page.
   */
  @Output() prev = new EventEmitter<void>();

  /**
   * Emits when user wants to jump to the first page.
   */
  @Output() goToStart = new EventEmitter<void>();

  maxPages = 0;

  /**
   * Validates input values, recalculates max. number of pages.
   */
  ngOnChanges(_changes: SimpleChanges): void {
    this.validateInputs();
    this.maxPages = Math.ceil(this.totalStories / this.pageSize);
  }

  /**
   * Returns true if the next page exists.
   */
  canGoNext(): boolean {
    return (this.currentPage + 1) * this.pageSize < this.totalStories;
  }

  /**
   * Returns true if there is a previous page.
   */
  canGoPrev(): boolean {
    return this.currentPage > 0;
  }

  /**
   * Emits 'next' event if next page is available.
   */
  handleNext(): void {
    if (this.canGoNext()) {
      this.next.emit();
    } else {
      console.warn('Next page is not available.');
    }
  }

  /**
   * Emits 'prev' event if not on the first page.
   */
  handlePrev(): void {
    if (this.canGoPrev()) {
      this.prev.emit();
    } else {
      console.warn('Already at the first page.');
    }
  }

  /**
   * Emits 'goToStart' event if not already at the start.
   */
  handleGoToStart(): void {
    if (this.canGoPrev()) {
      this.goToStart.emit();
    }
  }

  /**
   * Applies fallback defaults, logs warnings for invalid input bindings.
   */
  private validateInputs(): void {
    if (!Number.isInteger(this.currentPage) || this.currentPage < 0) {
      console.warn('Invalid currentPage input:', this.currentPage);
      this.currentPage = 0;
    }

    if (!Number.isInteger(this.pageSize) || this.pageSize <= 0) {
      console.warn('Invalid pageSize input:', this.pageSize);
      this.pageSize = 10;
    }

    if (!Number.isInteger(this.totalStories) || this.totalStories < 0) {
      console.warn('Invalid totalStories input:', this.totalStories);
      this.totalStories = 0;
    }
  }
}
