import { Ticket } from "./ticket";

export interface Section {
    sectionId: number;
    sectionTitle: string;
    description: string;
    tickets: Ticket[]
}
