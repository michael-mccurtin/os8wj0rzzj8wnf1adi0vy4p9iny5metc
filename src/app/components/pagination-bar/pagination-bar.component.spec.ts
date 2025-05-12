import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationBarComponent } from './pagination-bar.component';

describe('PaginationBarComponent', () => {
  let component: PaginationBarComponent;
  let fixture: ComponentFixture<PaginationBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaginationBarComponent], // using standalone component
    });

    fixture = TestBed.createComponent(PaginationBarComponent);
    component = fixture.componentInstance;
  });

  // Should apply default values for invalid inputs
  it('should set defaults for invalid inputs', () => {
    component.currentPage = -1;
    component.pageSize = 0;
    component.totalStories = -50;
    component.ngOnChanges({});
    expect(component.currentPage).toBe(0);
    expect(component.pageSize).toBe(10);
    expect(component.totalStories).toBe(0);
  });

  // Should correctly calculate the max number of pages
  it('should compute maxPages correctly', () => {
    component.pageSize = 20;
    component.totalStories = 85;
    component.ngOnChanges({});
    expect(component.maxPages).toBe(Math.ceil(85 / 20));
  });

  // Should emit "next" if not on the last page
  it('should emit next if canGoNext is true', () => {
    component.currentPage = 0;
    component.pageSize = 10;
    component.totalStories = 50;
    spyOn(component.next, 'emit');

    component.handleNext();
    expect(component.next.emit).toHaveBeenCalled();
  });

  // Should not emit "next" if on the last page
  it('should not emit next if canGoNext is false', () => {
    component.currentPage = 4;
    component.pageSize = 10;
    component.totalStories = 50;
    spyOn(component.next, 'emit');

    component.handleNext();
    expect(component.next.emit).not.toHaveBeenCalled();
  });

  // Should emit "prev" if not on the first page
  it('should emit prev if canGoPrev is true', () => {
    component.currentPage = 2;
    spyOn(component.prev, 'emit');

    component.handlePrev();
    expect(component.prev.emit).toHaveBeenCalled();
  });

  // Should not emit "prev" if on the first page
  it('should not emit prev if canGoPrev is false', () => {
    component.currentPage = 0;
    spyOn(component.prev, 'emit');

    component.handlePrev();
    expect(component.prev.emit).not.toHaveBeenCalled();
  });

  // Should emit "goToStart" if not on the first page
  it('should emit goToStart if canGoPrev is true', () => {
    component.currentPage = 3;
    spyOn(component.goToStart, 'emit');

    component.handleGoToStart();
    expect(component.goToStart.emit).toHaveBeenCalled();
  });

  // Should not emit "goToStart" if already on the first page
  it('should not emit goToStart if on first page', () => {
    component.currentPage = 0;
    spyOn(component.goToStart, 'emit');

    component.handleGoToStart();
    expect(component.goToStart.emit).not.toHaveBeenCalled();
  });
});
