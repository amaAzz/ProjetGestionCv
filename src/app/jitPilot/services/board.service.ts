import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Board } from '../models/board';
import { BoardPage } from '../models/board-page';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http:HttpClient) {}
getAllBoards():Observable<BoardPage>{
    return this.http.get<BoardPage>(`${environment.URL_API}/boards`);
}
getWorkspaceBoards():Observable<BoardPage>{
  return this.http.get<BoardPage>(`${environment.URL_API}/boards`);
}
newBoard(userId: number,workspaceId: number,board:Board):Observable<Board>{
    return this.http.post<Board>(`${environment.URL_API}/boards/create/${userId}/${workspaceId}/template`,board);
}
updateBoard(boardId: number,board:Board):Observable<Board>{
  return this.http.put<Board>(`${environment.URL_API}/boards/${boardId}`,board);
}
deleteBoard(boardId: number):Observable<Board>{
  return this.http.delete<Board>(`${environment.URL_API}/boards/${boardId}`);
}
getBoardById(boardId: number):Observable<Board>{
  return this.http.get<Board>(`${environment.URL_API}/boards/${boardId}`);
}
getBoardByWorkspaceId(workspacedId: number):Observable<Board[]>{
  return this.http.get<Board[]>(`${environment.URL_API}/boards/w/${workspacedId}`);
}
getBoardsByWorkspaceAndUser(workspacedId: number,userId: number):Observable<Board[]>{
  return this.http.get<Board[]>(`${environment.URL_API}/boards/w/${workspacedId}/u/${userId}`);
}
}
