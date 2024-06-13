import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { workspace } from '../models/workspace';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Board } from '../models/board';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  constructor(private http: HttpClient) { }

  getAllWorkspace(): Observable<workspace[]> {
    return this.http.get<workspace[]>(`${environment.URL_API}/workspaces`);
  }
  

  deleteWorkspace(id: number): Observable<workspace> {
    return this.http.delete<workspace>(`${environment.URL_API}/workspaces/${id}`);
  }


  getWorkspaceById(id: number): Observable<workspace> {
    return this.http.get<workspace>(`${environment.URL_API}/workspaces/${id}`);
  }

  create(id: number, data: workspace): Observable<workspace> {
    return this.http.post<workspace>(`${environment.URL_API}/workspaces/user/${id}`, data);
  }

  update(id: number, data: workspace): Observable<workspace> {
    return this.http.put<workspace>(`${environment.URL_API}/workspaces/${id}`, data);
  }

  getBoardByWorkspaceId(workspacedId: number):Observable<Board[]>{
    return this.http.get<Board[]>(`${environment.URL_API}/boards/w/${workspacedId}`);
  }

}
