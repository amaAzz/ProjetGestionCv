// src/app/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/modelsCv/user';
import { Role } from '../../models/modelsCv/Role';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'http://localhost:8080/users';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl);
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${id}`);
    }

    create(data: any): Observable<any> {
        return this.http.post(this.baseUrl, data);
    }

    updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(`${this.baseUrl}/${id}`, user);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

}
