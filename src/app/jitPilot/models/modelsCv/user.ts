import { Addresse } from './Addresse';
import { Role } from './Role';
import { Exportation } from './Exportation';

export class User {
    id?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    motDePasse?: string;
    role?: Role; // CANDIDAT or RECRUTEUR
    adresse?: Addresse;
    exportations?: Exportation[];

}






