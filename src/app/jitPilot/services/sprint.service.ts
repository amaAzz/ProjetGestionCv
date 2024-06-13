import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sprint } from '../models/sprint';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  constructor(private http:HttpClient) {}

  getSprintsByBoard(boardId: number): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${environment.URL_API}/sprints/board/${boardId}`);
  }

  addSprint(boardId: number, sprint: Sprint):Observable<Sprint>{
    return this.http.post<Sprint>(`${environment.URL_API}/sprints/board/${boardId}`, sprint);
}

}
