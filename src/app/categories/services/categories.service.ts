import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Categories } from '../models/categories.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = 'http://localhost:3003/categories';
  private categoriesSubject: BehaviorSubject<Categories[]> = new BehaviorSubject<Categories[]>([]);
  public categories$: Observable<Categories[]> = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadCategories(): void {
    this.http.get<Categories[]>(this.apiUrl).subscribe((categories) => {
      this.categoriesSubject.next(categories);
    });
  }

  getCategories(): Observable<Categories[]> {
    return this.http.get<Categories[]>(this.apiUrl);
  }

  createCategory(category: Categories): Observable<Categories> {
    return this.http.post<Categories>(this.apiUrl, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
