import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    // Configure testing module with required Angular Material modules and component
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        MatButtonToggleModule,
        MatIconModule,
        MatButtonModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Smoke test to verify component creation
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changeView', () => {
    // Should reject and not emit for invalid view mode inputs
    it('should not emit on invalid viewMode', () => {
      spyOn(component.viewModeChange, 'emit');

      const invalidMode = 'table' as unknown as 'grid' | 'list'; // type-safe bypass
      component.changeView(invalidMode);

      expect(component.viewModeChange.emit).not.toHaveBeenCalled();
    });

    // Should avoid emitting when selected mode is same as current
    it('should not emit when view mode is unchanged', () => {
      spyOn(component.viewModeChange, 'emit');
      component.viewMode = 'grid';
      component.changeView('grid');
      expect(component.viewModeChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('onToggleSelected', () => {
    // Should emit 'top' toggle when valid input received
    it('should emit valid toggle "top"', () => {
      spyOn(component.toggleSelected, 'emit');
      component.currentToggle = 'new';
      component.onToggleSelected('top');
      expect(component.toggleSelected.emit).toHaveBeenCalledWith('top');
    });

    // Should emit 'new' toggle when valid input received
    it('should emit valid toggle "new"', () => {
      spyOn(component.toggleSelected, 'emit');
      component.currentToggle = 'top';
      component.onToggleSelected('new');
      expect(component.toggleSelected.emit).toHaveBeenCalledWith('new');
    });

    // Should not emit if toggle value is outside expected enum
    it('should not emit on invalid toggle', () => {
      spyOn(component.toggleSelected, 'emit');

      const invalidToggle = 'hot' as unknown as 'top' | 'new';
      component.onToggleSelected(invalidToggle);

      expect(component.toggleSelected.emit).not.toHaveBeenCalled();
    });
  });
});
