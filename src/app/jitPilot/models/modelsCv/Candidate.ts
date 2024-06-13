import { User } from './user';
import { Cv } from './CurriculumVitae';


export  class Candidate {
    parcoursProfessionnel?: string;
    user?: User;
    cv?: Cv;
}
