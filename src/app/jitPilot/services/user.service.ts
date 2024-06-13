import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/user-response';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl: string = environment.URL_API + '/workspaces/1/users';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    constructor(private http: HttpClient) {}

    getUsers(): Observable<UserResponse[]> {
        return this.http.get<UserResponse[]>(this.apiUrl);
    }

    getUserById(id: number): Observable<UserResponse> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<UserResponse>(url);
    }

    createUser(user: UserResponse): Observable<UserResponse> {
        return this.http.post<UserResponse>(this.apiUrl, user, this.httpOptions);
    }

    updateUser(id: number, user: UserResponse): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put(url, user, this.httpOptions);
    }

    removeUser(id: number, idWorkspace: number): Observable<void> {
        const url = `${environment.URL_API}/workspaces/${idWorkspace}/removeUser/${id}`;
        return this.http.delete<void>(url);
    }

    getUserByWorkspace(workspacedId: number): Observable<UserResponse[]> {
        return this.http.get<UserResponse[]>(`${environment.URL_API}/workspaces/${workspacedId}/users`);
    }

    invitUserToWorkspace(workspacedId: number, userInvite: UserResponse): Observable<string> {
        return this.http.post<string>(`${environment.URL_API}/workspaces/${workspacedId}/inviteUser`,userInvite );
    }
}

