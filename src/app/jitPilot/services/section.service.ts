import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Section } from '../models/section';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private http:HttpClient) { }

  newSection(boardId: number,section:Section):Observable<Section>{
    return this.http.post<Section>(`${environment.URL_API}/section/board/${boardId}`,section);
  }

  updateSection(sectionId: number,section:Section):Observable<Section>{
    return this.http.put<Section>(`${environment.URL_API}/section/${sectionId}`,section);
  }

  deleteSection(sectionId: number):Observable<string>{
    return this.http.delete<string>(`${environment.URL_API}/section/${sectionId}`);
  }
}
