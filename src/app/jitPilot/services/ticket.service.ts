import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Ticket } from '../models/ticket';

@Injectable({
    providedIn: 'root',
})
export class TicketService {
    constructor(private http: HttpClient) {}

    newTicket(sectionId: number,sprintId: number, ticket: Ticket): Observable<Ticket> {
        return this.http.post<Ticket>(`${environment.URL_API}/tickets/${sectionId}/${sprintId}`, ticket);
    }

    updateTicket(ticketId: number, ticket: Ticket): Observable<Ticket> {
        return this.http.put<Ticket>(`${environment.URL_API}/tickets/${ticketId}`, ticket);
    }

    deleteTicket(ticketId: number): Observable<Ticket> {
        return this.http.delete<Ticket>(`${environment.URL_API}/tickets/${ticketId}`);
    }

    deleteAllTicket(sectionId: number): Observable<Ticket> {
        return this.http.delete<Ticket>(`${environment.URL_API}/tickets/deleteAll/${sectionId}`);
    }

    updateTickectSection(tickectId: number,sectionId: number): Observable<Ticket> {
        return this.http.put<Ticket>(`${environment.URL_API}/tickets/${tickectId}/section/${sectionId}`,{});
    }
    addUserInTicket(tickectId:number,userId:number){
        return this.http.put<Ticket>(`${environment.URL_API}/tickets/${tickectId}/assignuser/${userId}`,{});

    }
    removeUserFromTicket(tickectId:number,userId:number){
        return this.http.put<Ticket>(`${environment.URL_API}/tickets/${tickectId}/unassignuser/${userId}`,{});

    }

}
