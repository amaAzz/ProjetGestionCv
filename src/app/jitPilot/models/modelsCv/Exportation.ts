import { Candidate } from './Candidate';

export interface Exportation {
    id: string;
    candidats: Candidate[];
    formatExport: string;
    dateExport: Date;

}
