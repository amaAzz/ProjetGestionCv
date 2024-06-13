import { Region } from './Region';
import { Ville } from './Ville';

export interface Addresse {
    id: string;
    rue: string;
    ville: Ville;
    region: Region;
}
