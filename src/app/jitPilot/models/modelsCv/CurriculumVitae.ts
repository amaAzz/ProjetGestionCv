import { Candidate } from './Candidate';
import { Scolarite } from './Scolarite';
import { Competences } from './Competences';
import { Experience } from './Experience';
import { Langues } from './Langues';
import { Realisation } from './Realisation';

export  interface Cv {
    id: string;
    candidat: Candidate;
    contenu: string;
    dateDeCreation: Date;
    dateDeMiseAJour: Date;
    scolarite: Scolarite[];
    competences: Competences[];
    experiences: Experience[];
    langues: Langues[];
    realisations: Realisation[];

}
