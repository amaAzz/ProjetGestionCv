import { User } from './user';
import { Cv } from './CurriculumVitae';


export  interface Candidate {
    parcoursProfessionnel: string;
    user: User;
    cv: Cv;
}
