import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

/**
 * Navigation bar component that provides controls for toggling story type
 * ("top", "new") and switching between grid and list views.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private readonly validViewModes = ['grid', 'list'];
  private readonly validToggleTypes = ['top', 'new'];

  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() currentToggle: 'top' | 'new' = 'top';

  /**
   * Emits when user changes view mode between grid / list.
   */
  @Output() viewModeChange = new EventEmitter<'grid' | 'list'>();

  /**
   * Emits when user toggles between top / new posts.
   */
  @Output() toggleSelected = new EventEmitter<'top' | 'new'>();

  /**
   * Emits a toggle selection if it's valid.
   */
  onToggleSelected(value: 'top' | 'new'): void {
    if (!this.validToggleTypes.includes(value)) {
      console.warn(`Invalid toggleSelected value: '${value}'`);
      return;
    }

    this.toggleSelected.emit(value);
  }

  /**
   * Changes view mode between grid and list if it's valid.
   */
  changeView(mode: 'grid' | 'list'): void {
    if (!this.validViewModes.includes(mode)) {
      console.warn(`Invalid view mode: '${mode}'`);
      return;
    }
    if (this.viewMode === mode) return; // avoid emitting duplicate value
    this.viewModeChange.emit(mode);
  }
}
