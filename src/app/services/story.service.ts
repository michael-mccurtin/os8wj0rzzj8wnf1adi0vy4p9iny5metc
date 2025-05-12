import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';

/**
 * Service to fetch Hacker News stories and metadata.
 */
@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private readonly BASE_URL = 'https://hacker-news.firebaseio.com/v0';

  constructor(private http: HttpClient) {}

  /**
   * Fetches top story IDs from Hacker News.
   * @returns An observable emitting an array of story IDs or an empty array on error.
   */
  getTopStoryIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.BASE_URL}/topstories.json`).pipe(
      catchError((err) => {
        console.error('Failed to fetch top story IDs:', err);
        return of([]);
      }),
    );
  }

  /**
   * Fetches new story IDs from Hacker News.
   * @returns An observable emitting an array of story IDs or an empty array on error.
   */
  getNewStoryIds(): Observable<number[]> {
    return this.http.get<number[]>(`${this.BASE_URL}/newstories.json`).pipe(
      catchError((err) => {
        console.error('Failed to fetch new story IDs:', err);
        return of([]);
      }),
    );
  }

  /**
   * Fetches multiple stories by their IDs.
   * Filters out null values from failed fetches.
   * @param ids Array of Hacker News story IDs
   * @returns An observable emitting an array of valid Story objects
   */
  getStoriesByIds(ids: number[]): Observable<Story[]> {
    if (!ids?.length) return of([]);

    return forkJoin(ids.map((id) => this.getStory(id))).pipe(
      map((stories): Story[] => stories.filter((s): s is Story => s !== null)),
      catchError((err) => {
        console.error('Failed to fetch stories by IDs:', err);
        return of([]);
      }),
    );
  }

  /**
   * Fetches a single story by ID.
   * Returns `null` on failure instead of throwing.
   * @param id Hacker News story ID
   * @returns An observable emitting a Story or null
   */
  getStory(id: number): Observable<Story | null> {
    return this.http.get<Story>(`${this.BASE_URL}/item/${id}.json`).pipe(
      catchError((err) => {
        console.error(`Failed to fetch story ${id}:`, err);
        return of(null);
      }),
    );
  }
}

/**
 * Hacker News story object model.
 */
export interface Story {
  id: number;
  title: string;
  by: string;
  time: number;
  score: number;
  url?: string;
  type?: string;
  descendants?: number;
}
